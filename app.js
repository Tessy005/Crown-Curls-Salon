// Crown & Curls Salon - Main JavaScript File

const SALON_EMAIL = 'tessy9254@gmail.com';
const WHATSAPP_PHONE = '254111909015';

// Services Data
const servicesData = [
    {
        id: 1,
        name: 'Haircut & Styling',
        price: 'KSh 1,500',
        duration: '45 min',
        description: 'Professional haircut and styling with premium products',
        icon: 'fa-cut',
        image: 'images/styling.jpg',
        imageAlt: 'African woman receiving a salon haircut and styling'
    },
    {
        id: 2,
        name: 'Hair Coloring',
        price: 'KSh 4,500',
        duration: '120 min',
        description: 'Full hair coloring with premium ammonia-free products',
        icon: 'fa-palette',
        image: 'images/hair coloring.jfif',
        imageAlt: 'African woman with styled colored hair'
    },
    {
        id: 3,
        name: 'Manicure & Pedicure',
        price: 'KSh 2,000',
        duration: '60 min',
        description: 'Complete nail care treatment with massage',
        icon: 'fa-hand-sparkles',
        image: 'images/nail care.jfif',
        imageAlt: 'African woman manicure and nail care service'
    },
    {
        id: 4,
        name: 'Facial Treatment',
        price: 'KSh 3,000',
        duration: '60 min',
        description: 'Deep cleansing facial treatment for glowing skin',
        icon: 'fa-face-smile',
        image: 'images/make up.jfif',
        imageAlt: 'African woman enjoying a facial skincare treatment'
    },
    {
        id: 5,
        name: 'Bridal Makeup',
        price: 'KSh 8,000',
        duration: '90 min',
        description: 'Professional bridal makeup with airbrush technique',
        icon: 'fa-crown',
        image: 'images/bridal.jfif',
        imageAlt: 'African bride with professional makeup'
    },
    {
        id: 6,
        name: 'Spa Package',
        price: 'KSh 6,500',
        duration: '120 min',
        description: 'Full spa experience including massage and facial',
        icon: 'fa-spa',
        image: 'images/spa treatment.jfif',
        imageAlt: 'African woman relaxing during a spa treatment'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupTheme();
    setFooterYear();
    loadServices();
    loadAppointmentsFromStorage();
    setupEventListeners();
    updateBookingChannelLinks();
    setupCounters();
    setupDatePicker();
    setupFormValidation();
    loadSubscribersFromStorage();
});

function getStoredList(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch (error) {
        console.warn(`Unable to read ${key} from localStorage`, error);
        return [];
    }
}

function setStoredList(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Unable to save ${key} to localStorage`, error);
        return false;
    }
}

function setFooterYear() {
    const year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }
}

function setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const startingTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    const themeToggle = document.getElementById('themeToggle');

    applyTheme(startingTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem('theme', nextTheme);
        });
    }
}

function applyTheme(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const isDark = theme === 'dark';

    document.body.classList.toggle('dark-theme', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    if (themeToggle) {
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.innerHTML = `<i class="fas ${isDark ? 'fa-sun' : 'fa-moon'}"></i>`;
    }
}

function buildAppointmentMessage(appointment = {}) {
    const lines = [
        'Hello Tessy, I would like to book an appointment at Crown & Curls.',
        appointment.name ? `Name: ${appointment.name}` : '',
        appointment.email ? `Email: ${appointment.email}` : '',
        appointment.phone ? `Phone: ${appointment.phone}` : '',
        appointment.service ? `Service: ${appointment.service}` : '',
        appointment.date ? `Date: ${appointment.date}` : '',
        appointment.time ? `Time: ${appointment.time}` : '',
        appointment.message ? `Request: ${appointment.message}` : ''
    ];

    return lines.filter(Boolean).join('\n');
}

function getBookingLinks(appointment = {}) {
    const body = encodeURIComponent(buildAppointmentMessage(appointment));
    const subject = encodeURIComponent('Appointment Booking Request - Crown & Curls');

    return {
        whatsapp: `https://wa.me/${WHATSAPP_PHONE}?text=${body}`,
        email: `mailto:${SALON_EMAIL}?subject=${subject}&body=${body}`
    };
}

function updateBookingChannelLinks(appointment = {}) {
    const links = getBookingLinks(appointment);
    const whatsappLink = document.getElementById('whatsappBookingLink');
    const emailLink = document.getElementById('emailBookingLink');

    if (whatsappLink) {
        whatsappLink.href = links.whatsapp;
    }

    if (emailLink) {
        emailLink.href = links.email;
    }
}

function getAppointmentFormData() {
    return {
        name: document.getElementById('name')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        service: document.getElementById('service')?.value || '',
        date: document.getElementById('date')?.value || '',
        time: document.getElementById('time')?.value || '',
        message: document.getElementById('message')?.value.trim() || ''
    };
}

function escapeHTML(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

// Load Services dynamically
function loadServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    const serviceSelect = document.getElementById('service');
    
    if (servicesGrid) {
        servicesGrid.innerHTML = '';
        servicesData.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.innerHTML = `
                <div class="service-image">
                    <img src="${service.image}" alt="${service.imageAlt}" loading="lazy">
                </div>
                <div class="service-body">
                    <div class="service-icon">
                        <i class="fas ${service.icon}"></i>
                    </div>
                    <h3>${service.name}</h3>
                    <p class="service-price">${service.price}</p>
                    <p class="service-duration"><i class="far fa-clock"></i> ${service.duration}</p>
                    <p class="service-description">${service.description}</p>
                    <button class="btn-book-service" data-service="${service.name}">Book Now</button>
                </div>
            `;
            servicesGrid.appendChild(serviceCard);
        });
    }
    
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="">Choose a service</option>';
        servicesData.forEach(service => {
            const option = document.createElement('option');
            option.value = service.name;
            option.textContent = `${service.name} - ${service.price}`;
            serviceSelect.appendChild(option);
        });
    }
}

// Load appointments from localStorage
function loadAppointmentsFromStorage() {
    const appointments = getStoredList('appointments');
    console.log(`Loaded ${appointments.length} appointments`);
    return appointments;
}

// Save appointment to localStorage
function saveAppointment(appointment) {
    const appointments = getStoredList('appointments');
    appointment.id = Date.now();
    appointment.status = 'pending';
    appointment.createdAt = new Date().toISOString();
    appointments.push(appointment);
    setStoredList('appointments', appointments);
    return appointment;
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 100);
        });
    }
    
    // Book service buttons (delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-book-service')) {
            const service = e.target.getAttribute('data-service');
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                for(let i = 0; i < serviceSelect.options.length; i++) {
                    if(serviceSelect.options[i].value === service) {
                        serviceSelect.selectedIndex = i;
                        break;
                    }
                }
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Appointment form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
        appointmentForm.addEventListener('input', () => {
            updateBookingChannelLinks(getAppointmentFormData());
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Gallery lightbox
    setupGalleryLightbox();
    
    // Animate on scroll
    setupScrollAnimation();
}

// Handle Appointment Form Submission
function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    const { name, email, phone, service, date, time, message } = getAppointmentFormData();
    
    // Validation
    if (!name || !email || !phone || !service || !date || !time) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    const phoneRegex = /^[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        showAlert('Please enter a valid phone number (minimum 10 digits)', 'error');
        return;
    }
    
    // Check if date is in the past
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
        showAlert('Please select a future date', 'error');
        return;
    }
    
    // Create appointment object
    const appointment = {
        name: name,
        email: email,
        phone: phone,
        service: service,
        date: date,
        time: time,
        message: message
    };
    
    // Save to localStorage
    saveAppointment(appointment);
    updateBookingChannelLinks(appointment);
    const bookingLinks = getBookingLinks(appointment);
    const safeName = escapeHTML(name);
    
    // Show success message
    showAlert(`Thank you ${safeName}! Your appointment details are ready. Continue on <a href="${bookingLinks.whatsapp}" target="_blank" rel="noopener">WhatsApp</a> or <a href="${bookingLinks.email}">email Tessy</a> to confirm.`, 'success');
    window.open(bookingLinks.whatsapp, '_blank', 'noopener');
    
    // Reset form
    document.getElementById('appointmentForm').reset();
    updateBookingChannelLinks();
    
    // Send email notification (simulated)
    simulateEmailNotification(appointment);
}

// Handle Newsletter Submission
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('subscribeEmail').value.trim();
    
    if (!email) {
        showAlert('Please enter your email address', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    // Save to localStorage
    let subscribers = getStoredList('subscribers');
    
    if (subscribers.includes(email)) {
        showAlert('This email is already subscribed!', 'info');
    } else {
        subscribers.push(email);
        setStoredList('subscribers', subscribers);
        showAlert('Successfully subscribed to our newsletter!', 'success');
        document.getElementById('newsletterForm').reset();
    }
}

// Load subscribers from storage
function loadSubscribersFromStorage() {
    const subscribers = getStoredList('subscribers');
    console.log(`Loaded ${subscribers.length} subscribers`);
    return subscribers;
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    if (alertDiv) {
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = message;
        alertDiv.style.display = 'block';
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    } else {
        // Fallback alert
        alert(message);
    }
}

// Simulate email notification
function simulateEmailNotification(appointment) {
    console.log('Email notification would be sent to:', appointment.email);
    console.log('Appointment details:', appointment);
    
    // In a real scenario, you would use an email API or backend
    // This is just for demonstration
    setTimeout(() => {
        console.log('Confirmation email sent successfully');
    }, 1000);
}

// Setup date picker (minimum date = today)
function setupDatePicker() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// Setup form validation with real-time feedback
function setupFormValidation() {
    const inputs = document.querySelectorAll('#appointmentForm input, #appointmentForm select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    if (field.id === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        if (!isValid) {
            field.style.borderColor = '#dc3545';
        } else {
            field.style.borderColor = '#28a745';
        }
    } else if (field.id === 'phone' && value) {
        const phoneRegex = /^[\d\s\-\(\)]{10,}$/;
        isValid = phoneRegex.test(value);
        if (!isValid) {
            field.style.borderColor = '#dc3545';
        } else {
            field.style.borderColor = '#28a745';
        }
    } else if (field.required && !value) {
        field.style.borderColor = '#dc3545';
        isValid = false;
    } else if (value) {
        field.style.borderColor = '#28a745';
    }
    
    return isValid;
}

// Setup counter animation for stats
function setupCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    };
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Setup gallery lightbox
function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="close-lightbox">&times;</span>
                    <img src="${imgSrc}" alt="${imgAlt}">
                </div>
            `;
            document.body.appendChild(lightbox);
            document.body.classList.add('lightbox-open');
            lightbox.style.display = 'flex';
            
            const closeLightbox = () => {
                lightbox.remove();
                document.body.classList.remove('lightbox-open');
            };
            
            lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        });
    });
}

// Setup scroll animations
function setupScrollAnimation() {
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .gallery-item');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Export functions for debugging (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { servicesData, saveAppointment, loadAppointmentsFromStorage };
}

// Display total appointments count in console (for demo)
console.log('Crown & Curls Salon Website Loaded Successfully!');
console.log('Total Appointments:', getStoredList('appointments').length);
console.log('Total Subscribers:', getStoredList('subscribers').length);
