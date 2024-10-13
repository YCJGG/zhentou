const investorCount = 14;
let investors = [
    { name: "党员", initialCapital: 18.0893352 },
    { name: "义飞", initialCapital: 13.1498032 },
    { name: "杨博", initialCapital: 17.1498032 },
    { name: "狗哥", initialCapital: 9.9074756 },
    { name: "陶菊", initialCapital: 15.2102712 },
    { name: "小麦", initialCapital: 17.8474632 },
    { name: "益宏", initialCapital: 21.786084 },
    { name: "威杨", initialCapital: 10.544212 },
    { name: "🥩", initialCapital: 10.5623524 },
    { name: "cto", initialCapital: 22.1042244 },
    { name: "超神", initialCapital: 10.544212 },
    { name: "智🐲", initialCapital: 4.4539656 },
    { name: "李梓源", initialCapital: 2.060468 },
    { name: "黄森", initialCapital: 82.40733 }
];
let previousTotalFunds = 0;

let isAuthenticated = false;
const correctPassword = "zlnb"; // 设置您的密码

function initializeInvestors() {
    const investorInputs = document.getElementById('investorInputs');
    investors.forEach((investor, index) => {
        investor.id = index + 1;
        investor.currentProfit = 0;
        investor.currentFunds = investor.initialCapital;
        investorInputs.innerHTML += `
            <div class="input-group">
                <label for="investor${investor.id}">${investor.name} 初始本金:</label>
                <input type="number" id="investor${investor.id}" min="0" step="0.01" value="${investor.initialCapital.toFixed(2)}" disabled>
            </div>
        `;
    });

    // 从localStorage获取上次保存的值并设置为默认值
    const lastTotalProfit = localStorage.getItem('lastTotalProfit');
    if (lastTotalProfit) {
        document.getElementById('totalProfit').value = lastTotalProfit;
    }
}

function calculateProfits() {
    if (!isAuthenticated) {
        alert("请先进行身份验证。");
        return;
    }
    
    const currentTotalFunds = parseFloat(document.getElementById('totalProfit').value);
    
    // 保存当前输入的值到localStorage
    localStorage.setItem('lastTotalProfit', currentTotalFunds);

    let totalInitialCapital = 0;

    investors.forEach((investor, index) => {
        const inputValue = parseFloat(document.getElementById(`investor${index + 1}`).value);
        investor.initialCapital = isNaN(inputValue) ? investor.initialCapital : inputValue;
        totalInitialCapital += investor.initialCapital;
    });

    if (previousTotalFunds === 0) {
        previousTotalFunds = totalInitialCapital;
    }

    const dailyProfitOrLoss = currentTotalFunds - previousTotalFunds;

    if (dailyProfitOrLoss > 0) {
        const bonusInvestorIndex = investors.length - 1; // 黄森的索引
        const bonusInvestorProfit = dailyProfitOrLoss * 0.2;
        const remainingProfit = dailyProfitOrLoss * 0.8;

        investors.forEach((investor, index) => {
            const share = investor.initialCapital / totalInitialCapital;
            let investorProfit = share * remainingProfit;
            
            if (index === bonusInvestorIndex) {
                investorProfit += bonusInvestorProfit;
            }
            
            investor.currentProfit += investorProfit;
            investor.currentFunds = investor.initialCapital + investor.currentProfit;
        });
    } else {
        investors.forEach(investor => {
            const share = investor.initialCapital / totalInitialCapital;
            const dailyChange = share * dailyProfitOrLoss;
            investor.currentProfit += dailyChange;
            investor.currentFunds = investor.initialCapital + investor.currentProfit;
        });
    }

    previousTotalFunds = currentTotalFunds;

    updateProfitTable();
}

function updateProfitTable() {
    const table = document.getElementById('profitTable');
    table.innerHTML = `
        <tr>
            <th>投资者</th>
            <th>初始资金</th>
            <th>当前收益</th>
            <th>当前资金</th>
        </tr>
    `;

    investors.forEach(investor => {
        table.innerHTML += `
            <tr>
                <td>${investor.name}</td>
                <td>${investor.initialCapital.toFixed(2)}</td>
                <td>${investor.currentProfit.toFixed(2)}</td>
                <td>${investor.currentFunds.toFixed(2)}</td>
            </tr>
        `;
    });
}

function authenticate() {
    document.getElementById('authModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function verifyPassword() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput.value === correctPassword) {
        isAuthenticated = true;
        enableInputs();
        closeModal();
    } else {
        alert("密码错误，请重试。");
    }
    passwordInput.value = '';
}

function closeModal() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function enableInputs() {
    const totalProfitInput = document.getElementById('totalProfit');
    totalProfitInput.disabled = false;
    
    // 从localStorage获取上次保存的值
    const lastTotalProfit = localStorage.getItem('lastTotalProfit');
    if (lastTotalProfit) {
        totalProfitInput.value = lastTotalProfit;
    }
    
    // 添加事件监听器，在值改变时保存到localStorage
    totalProfitInput.addEventListener('change', function() {
        localStorage.setItem('lastTotalProfit', this.value);
    });

    document.querySelectorAll('#investorInputs input').forEach(input => {
        input.disabled = false;
    });
    document.querySelector('button[onclick="calculateProfits()"]').disabled = false;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeInvestors();
});
