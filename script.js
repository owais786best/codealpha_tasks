class AgeCalculator {
    constructor() {
        this.form = document.getElementById('ageForm');
        this.birthdateInput = document.getElementById('birthdate');
        this.result = document.getElementById('result');
        this.yearsElement = document.getElementById('years');
        this.monthsElement = document.getElementById('months');
        this.daysElement = document.getElementById('days');
        this.totalDaysElement = document.getElementById('totalDays');
        this.totalHoursElement = document.getElementById('totalHours');
        this.totalMinutesElement = document.getElementById('totalMinutes');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setMaxDate();
    }
    
    setMaxDate() {
        const today = new Date().toISOString().split('T')[0];
        this.birthdateInput.setAttribute('max', today);
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        const birthdate = this.birthdateInput.value;
        if (!birthdate) {
            this.showError('Please select your date of birth');
            return;
        }
        
        const birthdateObj = new Date(birthdate);
        const today = new Date();
        
        if (birthdateObj > today) {
            this.showError('Birth date cannot be in the future');
            return;
        }
        
        this.calculateAge(birthdateObj, today);
    }
    
    calculateAge(birthdate, currentDate) {
        const age = this.getAgeDetails(birthdate, currentDate);
        this.displayResults(age);
    }
    
    getAgeDetails(birthdate, currentDate) {
        // Calculate years, months, and days
        let years = currentDate.getFullYear() - birthdate.getFullYear();
        let months = currentDate.getMonth() - birthdate.getMonth();
        let days = currentDate.getDate() - birthdate.getDate();
        
        // Adjust for negative days
        if (days < 0) {
            months--;
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate total values
        const totalMilliseconds = currentDate.getTime() - birthdate.getTime();
        const totalDays = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        const totalMinutes = Math.floor(totalMilliseconds / (1000 * 60));
        
        return {
            years,
            months,
            days,
            totalDays,
            totalHours,
            totalMinutes
        };
    }
    
    displayResults(age) {
        // Animate numbers counting up
        this.animateNumber(this.yearsElement, 0, age.years, 1000);
        this.animateNumber(this.monthsElement, 0, age.months, 1200);
        this.animateNumber(this.daysElement, 0, age.days, 1400);
        
        // Update additional info with formatting
        this.totalDaysElement.textContent = age.totalDays.toLocaleString();
        this.totalHoursElement.textContent = age.totalHours.toLocaleString();
        this.totalMinutesElement.textContent = age.totalMinutes.toLocaleString();
        
        // Show result with animation
        this.result.classList.add('show');
        this.result.scrollIntoView({ behavior: 'smooth' });
    }
    
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const range = end - start;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (range * easeOutCubic));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e53e3e;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(229, 62, 62, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 3000);
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#error-animations')) {
            const style = document.createElement('style');
            style.id = 'error-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AgeCalculator();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add floating animation to the card
    const card = document.querySelector('.card');
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 50;
        mouseY = (e.clientY - window.innerHeight / 2) / 50;
    });
    
    function animate() {
        card.style.transform = `perspective(1000px) rotateX(${mouseY}deg) rotateY(${mouseX}deg) translateZ(0)`;
        requestAnimationFrame(animate);
    }
    
    animate();
});