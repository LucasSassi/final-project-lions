const API_URL = 'https://final-project-0hy5.onrender.com/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// DOM Elements
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const addCarBtn = document.getElementById('addCarBtn');
const carModal = document.getElementById('carModal');
const carForm = document.getElementById('carForm');
const closeModal = document.querySelector('.close');
const carsGrid = document.getElementById('carsGrid');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const modalTitle = document.getElementById('modalTitle');

// Filter elements
const searchInput = document.getElementById('searchInput');
const filterYear = document.getElementById('filterYear');
const filterColor = document.getElementById('filterColor');
const filterPrice = document.getElementById('filterPrice');
const clearFiltersBtn = document.getElementById('clearFilters');

// Set user name
userName.textContent = localStorage.getItem('userName') || 'Usuário';

// Current car being edited
let currentCarId = null;
let allCars = []; // Store all cars for filtering

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});

// Open modal for adding car
addCarBtn.addEventListener('click', () => {
    currentCarId = null;
    modalTitle.textContent = 'Adicionar Carro';
    carForm.reset();
    carModal.style.display = 'block';
});

// Close modal
closeModal.addEventListener('click', () => {
    carModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === carModal) {
        carModal.style.display = 'none';
    }
});

// Load cars on page load
loadCars();

// Search and filter event listeners
searchInput.addEventListener('input', applyFilters);
filterYear.addEventListener('change', applyFilters);
filterColor.addEventListener('change', applyFilters);
filterPrice.addEventListener('change', applyFilters);

clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterYear.value = '';
    filterColor.value = '';
    filterPrice.value = '';
    applyFilters();
});

// Form submission
carForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const carData = {
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        year: parseInt(document.getElementById('year').value),
        color: document.getElementById('color').value,
        mileage: parseInt(document.getElementById('mileage').value),
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value
    };
    
    console.log('Enviando dados do carro:', carData);
    console.log('ID do carro atual:', currentCarId);
    
    try {
        const url = currentCarId 
            ? `${API_URL}/cars/${currentCarId}`
            : `${API_URL}/cars`;
        
        const method = currentCarId ? 'PUT' : 'POST';
        
        console.log(`Fazendo ${method} para ${url}`);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(carData)
        });
        
        console.log('Status da resposta:', response.status);
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        if (response.ok) {
            carModal.style.display = 'none';
            showSuccess(currentCarId ? 'Carro atualizado com sucesso!' : 'Carro adicionado com sucesso!');
            loadCars();
        } else {
            showError(data.message || data.error || 'Erro ao salvar carro');
        }
    } catch (error) {
        showError('Erro ao conectar com o servidor');
        console.error('Erro completo:', error);
    }
});

// Load all cars
async function loadCars() {
    try {
        console.log('Carregando carros...');
        const response = await fetch(`${API_URL}/cars`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Status da resposta:', response.status);
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        if (response.ok) {
            // API retorna array direto ou objeto {cars: []}
            allCars = Array.isArray(data) ? data : (data.cars || []);
            console.log('Lista de carros:', allCars);
            
            // Populate filter dropdowns
            populateFilters();
            
            // Display all cars initially
            applyFilters();
        } else {
            showError('Erro ao carregar carros: ' + (data.message || data.error));
        }
    } catch (error) {
        showError('Erro ao conectar com o servidor');
        console.error('Erro completo:', error);
    }
}

// Populate filter dropdowns with unique values
function populateFilters() {
    // Get unique years
    const years = [...new Set(allCars.map(car => car.year))].sort((a, b) => b - a);
    filterYear.innerHTML = '<option value="">Todos os anos</option>' + 
        years.map(year => `<option value="${year}">${year}</option>`).join('');
    
    // Get unique colors
    const colors = [...new Set(allCars.map(car => car.color))].sort();
    filterColor.innerHTML = '<option value="">Todas as cores</option>' + 
        colors.map(color => `<option value="${color}">${color}</option>`).join('');
}

// Apply all filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedYear = filterYear.value;
    const selectedColor = filterColor.value;
    const selectedPrice = filterPrice.value;
    
    let filteredCars = allCars;
    
    // Search filter
    if (searchTerm) {
        filteredCars = filteredCars.filter(car => 
            car.brand.toLowerCase().includes(searchTerm) || 
            car.model.toLowerCase().includes(searchTerm)
        );
    }
    
    // Year filter
    if (selectedYear) {
        filteredCars = filteredCars.filter(car => car.year == selectedYear);
    }
    
    // Color filter
    if (selectedColor) {
        filteredCars = filteredCars.filter(car => car.color === selectedColor);
    }
    
    // Price filter
    if (selectedPrice) {
        const [minPrice, maxPrice] = selectedPrice.split('-').map(Number);
        filteredCars = filteredCars.filter(car => 
            car.price >= minPrice && car.price <= maxPrice
        );
    }
    
    displayCars(filteredCars);
}

// Display cars in grid
function displayCars(cars) {
    if (cars.length === 0) {
        carsGrid.innerHTML = '<div class="loading">Nenhum carro encontrado. Adicione o primeiro!</div>';
        return;
    }
    
    console.log('Exibindo carros:', cars);
    
    carsGrid.innerHTML = cars.map(car => {
        // MongoDB usa _id, não id
        const carId = car._id || car.id;
        console.log('ID do carro:', carId, car);
        
        // Informações do vendedor
        const seller = car.createdBy || {};
        const sellerPhone = seller.phone ? `<p><strong>Contato:</strong> ${seller.phone}</p>` : '';
        const sellerName = seller.name ? `<p><strong>Vendedor:</strong> ${seller.name}</p>` : '';
        
        return `
        <div class="car-card">
            <h3>${car.brand} ${car.model}</h3>
            <div class="car-info">
                <p><strong>Ano:</strong> ${car.year}</p>
                <p><strong>Cor:</strong> ${car.color}</p>
                <p><strong>Quilometragem:</strong> ${formatNumber(car.mileage)} km</p>
                <p><strong>Descrição:</strong> ${car.description || 'Sem descrição'}</p>
                ${sellerName}
                ${sellerPhone}
            </div>
            <div class="car-price">R$ ${formatPrice(car.price)}</div>
            <div class="car-actions">
                <button class="btn-edit" onclick="editCar('${carId}')">Editar</button>
                <button class="btn-delete" onclick="deleteCar('${carId}')">Excluir</button>
            </div>
        </div>`;
    }).join('');
}

// Edit car
async function editCar(carId) {
    try {
        console.log('Carregando carro para edição:', carId);
        const response = await fetch(`${API_URL}/cars/${carId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Status da resposta:', response.status);
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        if (response.ok) {
            // API pode retornar o carro direto ou {car: ...}
            const car = data.car || data;
            currentCarId = carId;
            modalTitle.textContent = 'Editar Carro';
            
            document.getElementById('brand').value = car.brand;
            document.getElementById('model').value = car.model;
            document.getElementById('year').value = car.year;
            document.getElementById('color').value = car.color;
            document.getElementById('mileage').value = car.mileage;
            document.getElementById('price').value = car.price;
            document.getElementById('description').value = car.description || '';
            
            carModal.style.display = 'block';
        } else {
            showError('Erro ao carregar dados do carro: ' + (data.message || data.error));
        }
    } catch (error) {
        showError('Erro ao conectar com o servidor');
        console.error('Erro completo:', error);
    }
}

// Delete car
async function deleteCar(carId) {
    if (!confirm('Tem certeza que deseja excluir este carro?')) {
        return;
    }
    
    try {
        console.log('Excluindo carro:', carId);
        const response = await fetch(`${API_URL}/cars/${carId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Status da resposta:', response.status);
        
        if (response.ok) {
            showSuccess('Carro excluído com sucesso!');
            loadCars();
        } else {
            const data = await response.json();
            console.log('Erro ao excluir:', data);
            showError(data.message || data.error || 'Erro ao excluir carro');
        }
    } catch (error) {
        showError('Erro ao conectar com o servidor');
        console.error('Erro completo:', error);
    }
}

// Helper functions
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

function formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Make functions globally accessible
window.editCar = editCar;
window.deleteCar = deleteCar;
