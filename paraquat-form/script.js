document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('qualification-form');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const progressBar = document.querySelector('.progress-bar');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const submitButton = document.querySelector('.submit-btn');
    const charCount = document.getElementById('charCount');
    const caseDetailsTextarea = document.getElementById('caseDetails');
    
    // Current step tracking - starting at 1 to match data-step attributes
    let currentStep = 1;
    
    // Initialize the form
    function initForm() {
        // Show the first step
        showStep(currentStep);
        
        // Add event listeners to next buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    nextStep();
                }
            });
        });
        
        // Add event listeners to back buttons
        backButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                prevStep();
            });
        });
        
        // Add event listener to the form submission
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    submitForm();
                }
            });
        }
        
        // Add character counter for textarea
        if (caseDetailsTextarea && charCount) {
            const maxChars = 500;
            
            caseDetailsTextarea.addEventListener('input', function() {
                const currentLength = this.value.length;
                charCount.textContent = currentLength;
                
                if (currentLength > maxChars) {
                    this.value = this.value.substring(0, maxChars);
                    charCount.textContent = maxChars;
                }
                
                if (currentLength >= maxChars * 0.8) {
                    charCount.style.color = '#f44336';
                } else {
                    charCount.style.color = '#777';
                }
            });
        }
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                let digits = this.value.replace(/\D/g, '');
                
                digits = digits.substring(0, 10);
                
                if (digits.length > 0) {
                    if (digits.length <= 3) {
                        this.value = digits;
                    } else if (digits.length <= 6) {
                        this.value = `(${digits.substring(0, 3)}) ${digits.substring(3)}`;
                    } else {
                        this.value = `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
                    }
                }
            });
        }
    }
    
    // Show the specified step
    function showStep(stepNumber) {
        formSteps.forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });
        
        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            
            if (stepNum < stepNumber) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
        
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
            
            // Force a reflow to ensure CSS transitions work properly
            void currentStepElement.offsetWidth;
            
            setTimeout(() => {
                currentStepElement.classList.add('active');
            }, 10);
        }
    }
    
    // Move to the next step
    function nextStep() {
        if (currentStep < formSteps.length) {
            currentStep++;
            showStep(currentStep);
            window.scrollTo(0, 0);
        }
    }
    
    // Move to the previous step
    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            window.scrollTo(0, 0);
        }
    }
    
    // Validate the current step
    function validateStep(stepNumber) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (!currentStepElement) return false;
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        // Remove any existing error messages
        const errorMessages = currentStepElement.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
        
        // Reset all fields
        const allFields = currentStepElement.querySelectorAll('input, select, textarea');
        allFields.forEach(field => {
            field.classList.remove('error');
            const label = document.querySelector(`label[for="${field.id}"]`);
            if (label) {
                label.classList.remove('error');
            }
        });
        
        // Validate each required field
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                showError(field, 'Please enter a valid email address');
            } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                isValid = false;
                showError(field, 'Please enter a valid phone number');
            } else if (field.type === 'checkbox' && !field.checked) {
                isValid = false;
                showError(field, 'You must agree to continue');
            }
        });
        
        if (!isValid) {
            const firstErrorField = currentStepElement.querySelector('.error');
            if (firstErrorField) firstErrorField.focus();
        }
        
        return isValid;
    }
    
    // Show error message for a field
    function showError(field, message) {
        field.classList.add('error');
        
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) {
            label.classList.add('error');
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#f44336';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        
        // Insert the error message after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validate phone number format
    function isValidPhone(phone) {
        // Allow various formats: (123) 456-7890, 123-456-7890, 123.456.7890, etc.
        const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        return phoneRegex.test(phone);
    }
    
    // Submit the form
    function submitForm() {
        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading-spinner"></span>Submitting...';
        }
        
        // Collect form data
        const formData = new FormData(form);
        const formDataObj = {};
        
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            console.log('Form submitted:', formDataObj);
            
            // Show success message
            currentStep = 4;
            showStep(currentStep);
            
            // Update progress bar to completed state
            progressBar.classList.add('completed');
            
            // Reset form for future submissions
            form.reset();
            
            // Scroll to top
            window.scrollTo(0, 0);
        }, 1500);
    }
    
    // Initialize the form
    initForm();
}); 