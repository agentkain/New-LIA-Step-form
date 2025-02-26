document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentStep = 1;
    const form = document.getElementById('qualification-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const progressBar = document.querySelector('.progress-bar');
    const maxChars = 500;
    
    // Show the initial step
    showStep(currentStep);
    
    // Add event listeners to next buttons
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
                updateProgressBar();
            }
        });
    });
    
    // Add event listeners to back buttons
    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            currentStep--;
            showStep(currentStep);
            updateProgressBar();
        });
    });
    
    // Character counter for textarea
    const caseDetailsTextarea = document.getElementById('caseDetails');
    const charCount = document.getElementById('charCount');
    
    if (caseDetailsTextarea && charCount) {
        // Initialize character count
        charCount.textContent = '0';
        
        caseDetailsTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > maxChars) {
                charCount.style.color = '#f44336';
                this.value = this.value.substring(0, maxChars);
                charCount.textContent = maxChars;
            } else {
                charCount.style.color = '#777';
            }
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                // Show loading spinner
                const submitBtn = document.querySelector('.submit-btn');
                const loadingSpinner = document.createElement('span');
                loadingSpinner.className = 'loading-spinner';
                submitBtn.prepend(loadingSpinner);
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual form submission)
                setTimeout(function() {
                    // Hide form steps and show success message
                    document.querySelectorAll('.form-step').forEach(step => {
                        step.classList.remove('active');
                    });
                    document.querySelector('.form-step[data-step="4"]').classList.add('active');
                    
                    // Update progress bar to completed state
                    progressBar.classList.add('completed');
                    progressSteps.forEach(step => {
                        step.classList.add('completed');
                    });
                    
                    // Scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 1500);
            }
        });
    }
    
    // Function to show the current step
    function showStep(stepNumber) {
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }
    
    // Function to update the progress bar
    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            
            if (stepNum < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    // Function to validate the current step
    function validateStep(stepNumber) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (!currentStepElement) return true;
        
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            // Remove existing error styling
            field.classList.remove('error');
            
            // Check if field is empty
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                
                // Add shake animation
                field.addEventListener('animationend', function() {
                    this.classList.remove('shake');
                });
                field.classList.add('shake');
            }
            
            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    field.classList.add('error');
                    isValid = false;
                }
            }
            
            // Phone validation
            if (field.id === 'phone' && field.value.trim()) {
                const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
                if (!phonePattern.test(field.value)) {
                    field.classList.add('error');
                    isValid = false;
                }
            }
        });
        
        // Scroll to the first error field
        if (!isValid) {
            const firstError = currentStepElement.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
        
        return isValid;
    }
}); 