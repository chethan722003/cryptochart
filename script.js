let cryptoChart;

// Function to fetch crypto prices and update page
async function fetchCryptoPrices(currency = 'usd') {
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,cardano,solana,polkadot,xrp,binancecoin,litecoin,stellar,bitcoin-cash,uniswap,chainlink,vechain,tezos&vs_currencies=${currency}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Update prices on the page
        document.getElementById('btc-price').textContent = data.bitcoin[currency].toFixed(2);
        document.getElementById('eth-price').textContent = data.ethereum[currency].toFixed(2);
        document.getElementById('doge-price').textContent = data.dogecoin[currency].toFixed(4);
        document.getElementById('ada-price').textContent = data.cardano[currency].toFixed(4);
        document.getElementById('sol-price').textContent = data.solana[currency].toFixed(2);
        document.getElementById('dot-price').textContent = data.polkadot[currency].toFixed(2);
        document.getElementById('link-price').textContent = data.chainlink[currency].toFixed(2);
        document.getElementById('card-price').textContent = data.cardano[currency].toFixed(2);
        document.getElementById('solana-price').textContent = data.solana[currency].toFixed(2);
        document.getElementById('polkadot-price').textContent = data.polkadot[currency].toFixed(2);
        document.getElementById('binan-price').textContent = data.binancecoin[currency].toFixed(2);
        document.getElementById('lite-price').textContent = data.litecoin[currency].toFixed(2);
        document.getElementById('uniswap-price').textContent = data.uniswap[currency].toFixed(2);
        document.getElementById('vechain-price').textContent = data.vechain[currency].toFixed(2);
        document.getElementById('tezos-price').textContent = data.tezos[currency].toFixed(2);
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
    }
}

// Call fetchCryptoPrices on page load
fetchCryptoPrices();

// Currency select change event
document.getElementById('currencySelect').addEventListener('change', function () {
    const selectedCurrency = this.value;
    fetchCryptoPrices(selectedCurrency);
});


// Function to show an advanced chart for the selected crypto
async function showAdvancedChart(cryptos) {
    const promises = cryptos.map(crypto =>
        fetch(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=7`)
            .then(response => response.json())
    );

    try {
        const results = await Promise.all(promises);
        const labels = results[0].prices.map(priceData => {
            const date = new Date(priceData[0]);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const datasets = results.map((result, index) => {
            const cryptoName = cryptos[index];
            const prices = result.prices.map(priceData => priceData[1]);

            return {
                label: `${cryptoName.toUpperCase()} Price (Last 7 Days)`,
                data: prices,
                borderColor: getRandomColor(),
                fill: false,
                tension: 0.1
            };
        });

        updateChart(labels, datasets);
    } catch (error) {
        console.error('Error fetching historical data:', error);
    }
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to update chart with new data
function updateChart(labels, datasets) {
    const ctx = document.getElementById('cryptoChart').getContext('2d');

    if (cryptoChart) {
        cryptoChart.destroy();
    }

    cryptoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    },
                    beginAtZero: false
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        mode: 'x'
                    },
                    pan: {
                        enabled: true,
                        mode: 'x'
                    }
                }
            }
        }
    });
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '🌞 Light Mode';
        darkModeToggle.classList.remove('light-mode');
        darkModeToggle.classList.add('dark-mode');
    } else {
        darkModeToggle.textContent = '🌙 Dark Mode';
        darkModeToggle.classList.remove('dark-mode');
        darkModeToggle.classList.add('light-mode');
    }
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting (default action)

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);

    // You can perform further form validation or send the data to your backend here.

    // Optionally, you can hide the modal after form submission
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.hide();

    // Reset form after submission
    document.getElementById('loginForm').reset();
});

// Toggle Other section visibility
function toggleOtherSection() {
    const otherSection = document.getElementById('other-crypto-section');
    if (otherSection.classList.contains('hidden')) {
        otherSection.classList.remove('hidden');  // Show section
        fetchCryptoPrices();  // Fetch prices when showing
    } else {
        otherSection.classList.add('hidden');  // Hide section
    }
}
// Function to set background images from data attributes
function setBackgroundImages() {
    document.querySelectorAll('.section').forEach(section => {
        const bgUrl = section.getAttribute('data-bg-url');
        section.style.backgroundImage = `url(${bgUrl})`;
    });
}

// Set background images when the page loads
window.onload = setBackgroundImages;




document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '89d3002258a2f10f56ffd228';
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            populateCurrencyOptions(data);
            document.getElementById('converter-form').addEventListener('submit', function(event) {
                event.preventDefault();
                convertCurrency(data);
            });
        });

    function populateCurrencyOptions(data) {
        const fromSelect = document.getElementById('from');
        const toSelect = document.getElementById('to');
        const currencies = Object.keys(data.conversion_rates);

        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            fromSelect.appendChild(option.cloneNode(true));
            toSelect.appendChild(option);
        });
    }

    function convertCurrency(data) {
        const amount = parseFloat(document.getElementById('amount').value);
        const fromCurrency = document.getElementById('from').value;
        const toCurrency = document.getElementById('to').value;

        if (isNaN(amount) || amount <= 0) {
            document.getElementById('result').textContent = 'Please enter a valid amount.';
            return;
        }

        const rate = data.conversion_rates[toCurrency] / data.conversion_rates[fromCurrency];
        const convertedAmount = (amount * rate).toFixed(2);
        document.getElementById('result').textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    }
});
function calculate() {
    var cryptoAmount = document.getElementById('cryptoAmount').value;
    var cryptoRate = document.getElementById('cryptoRate').value;
    var usdAmount = cryptoAmount * cryptoRate;
    document.getElementById('usdAmount').value = usdAmount.toFixed(2);
}
function calculateProfit() {
    var purchasePrice = document.getElementById('purchasePrice').value;
    var currentPrice = document.getElementById('currentPrice').value;
    var numberOfCoins = document.getElementById('numberOfCoins').value;

    var profitLoss = (currentPrice - purchasePrice) * numberOfCoins;
    document.getElementById('profitLoss').value = profitLoss.toFixed(2);
}



function updateCurrencySymbol() {
    // Get the selected currency symbol
    const currencySelect = document.getElementById('currency-select');
    const selectedSymbol = currencySelect.value;

    // Update the symbol in the price display
    document.getElementById('currency-symbol').textContent = selectedSymbol;

    // You can also update the price here if your converter is integrated
    // For example:
    // convertPriceToSelectedCurrency(selectedSymbol);
}
