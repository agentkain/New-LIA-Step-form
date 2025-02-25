document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('qualification-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-bar .step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const charCount = document.getElementById('charCount');
    const caseDetails = document.getElementById('caseDetails');
    
    let currentStep = 1;
    
    // Initialize the first step
    showStep(currentStep);
    
    // Next button event listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // For step 1, validate all required fields and show specific alerts
            if (currentStep === 1) {
                const firstNameField = document.getElementById('firstName');
                const lastNameField = document.getElementById('lastName');
                const emailField = document.getElementById('email');
                const phoneField = document.getElementById('phone');
                const caseTypeSelect = document.getElementById('caseType');
                
                let emptyFields = [];
                let isValid = true;
                
                // Check each field
                if (!firstNameField.value.trim()) {
                    firstNameField.classList.add('error');
                    document.querySelector('label[for="firstName"]').classList.add('error');
                    emptyFields.push('First Name');
                    isValid = false;
                }
                
                if (!lastNameField.value.trim()) {
                    lastNameField.classList.add('error');
                    document.querySelector('label[for="lastName"]').classList.add('error');
                    emptyFields.push('Last Name');
                    isValid = false;
                }
                
                if (!emailField.value.trim()) {
                    emailField.classList.add('error');
                    document.querySelector('label[for="email"]').classList.add('error');
                    emptyFields.push('Email');
                    isValid = false;
                }
                
                if (!phoneField.value.trim()) {
                    phoneField.classList.add('error');
                    document.querySelector('label[for="phone"]').classList.add('error');
                    emptyFields.push('Phone Number');
                    isValid = false;
                }
                
                if (!caseTypeSelect.value) {
                    caseTypeSelect.classList.add('error');
                    document.querySelector('label[for="caseType"]').classList.add('error');
                    emptyFields.push('Case Type');
                    isValid = false;
                }
                
                // If any fields are empty, show alert with the specific fields
                if (!isValid) {
                    alert(`Please fill in the following required fields: ${emptyFields.join(', ')}`);
                    
                    // Focus on the first empty field
                    const firstErrorField = document.querySelector('.form-step[data-step="1"] .error');
                    if (firstErrorField) firstErrorField.focus();
                    
                    return;
                }
                
                // Add event listeners to remove error class when user interacts with fields
                [firstNameField, lastNameField, emailField, phoneField, caseTypeSelect].forEach(field => {
                    field.addEventListener('input', function() {
                        if (this.value.trim()) {
                            this.classList.remove('error');
                            const label = document.querySelector(`label[for="${this.id}"]`);
                            if (label) label.classList.remove('error');
                        }
                    }, { once: true });
                });
                
                // If all fields are valid, proceed to next step
                goToNextStep();
            } else {
                // For other steps, use the existing validation
                if (validateStep(currentStep)) {
                    goToNextStep();
                }
            }
        });
    });
    
    // Back button event listeners
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToPreviousStep();
        });
    });
    
    // Character count for textarea with limit
    if (caseDetails && charCount) {
        const maxChars = 500;
        
        // Update character count on input
        caseDetails.addEventListener('input', () => {
            const currentLength = caseDetails.value.length;
            charCount.textContent = currentLength;
            
            // Enforce character limit
            if (currentLength > maxChars) {
                caseDetails.value = caseDetails.value.substring(0, maxChars);
                charCount.textContent = maxChars;
            }
            
            // Visual feedback when approaching limit
            if (currentLength >= maxChars * 0.8) {
                charCount.style.color = '#f44336';
            } else {
                charCount.style.color = '#777';
            }
        });
        
        // Also check on paste events
        caseDetails.addEventListener('paste', (e) => {
            setTimeout(() => {
                if (caseDetails.value.length > maxChars) {
                    caseDetails.value = caseDetails.value.substring(0, maxChars);
                    charCount.textContent = maxChars;
                    charCount.style.color = '#f44336';
                }
            }, 0);
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // Show loading state
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual AJAX call)
            setTimeout(() => {
                // Here you would typically send the form data to your server
                currentStep = 4; // Move to success step
                showStep(currentStep);
                
                // Reset button state (not needed as the button is now hidden)
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
    
    // Case type selection handling
    const caseTypeSelect = document.getElementById('caseType');
    const caseQuestionSections = document.querySelectorAll('.case-questions');
    const caseTypeTitle = document.getElementById('case-type-title');
    
    if (caseTypeSelect) {
        caseTypeSelect.addEventListener('change', function() {
            const selectedCaseType = this.value;
            
            // Update the case type title
            if (caseTypeTitle) {
                // Get the selected option's text
                const selectedOptionText = this.options[this.selectedIndex].text;
                caseTypeTitle.textContent = selectedOptionText + ' Case Details';
            }
            
            // Hide all case question sections
            caseQuestionSections.forEach(section => {
                section.style.display = 'none';
                
                // Disable required fields in hidden sections
                const requiredFields = section.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    field.disabled = true;
                });
            });
            
            // Show the selected case type questions
            const selectedSection = document.getElementById(`${selectedCaseType}-questions`);
            if (selectedSection) {
                selectedSection.style.display = 'block';
                
                // Enable required fields in visible section
                const requiredFields = selectedSection.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    field.disabled = false;
                });
            }
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Get only digits from the input
            let digits = this.value.replace(/\D/g, '');
            
            // Limit to 10 digits (US phone number)
            digits = digits.substring(0, 10);
            
            // Format the phone number as (XXX) XXX-XXXX
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
        
        // Also handle paste events
        phoneInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                // Trigger the input event handler
                const inputEvent = new Event('input');
                this.dispatchEvent(inputEvent);
            }, 0);
        });
    }
    
    function showStep(stepNumber) {
        // First hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });
        
        // Update progress bar
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
        
        // Show the current step with animation
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        currentStepElement.style.display = 'block';
        
        // Trigger reflow to ensure animation works
        void currentStepElement.offsetWidth;
        
        // Add active class to trigger animation
        setTimeout(() => {
            currentStepElement.classList.add('active');
        }, 10);
    }
    
    function goToNextStep() {
        if (currentStep < steps.length) {
            currentStep++;
            showStep(currentStep);
        }
    }
    
    function goToPreviousStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }
    
    function validateStep(stepNumber) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        let requiredFields;
        
        // For step 2, only validate the visible case questions
        if (stepNumber === 2) {
            const visibleCaseSection = currentStepElement.querySelector('.case-questions[style="display: block;"]');
            if (visibleCaseSection) {
                requiredFields = visibleCaseSection.querySelectorAll('[required]:not([disabled])');
            } else {
                // No case type selected or visible
                alert("Please select a case type on the previous step.");
                return false;
            }
        } else {
            // For other steps, validate all required fields
            requiredFields = currentStepElement.querySelectorAll('[required]:not([disabled])');
        }
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            const fieldLabel = document.querySelector(`label[for="${field.id}"]`);
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                if (fieldLabel) fieldLabel.classList.add('error');
                
                // Add event listener to remove error class when user interacts with the field
                field.addEventListener('input', function() {
                    if (this.value.trim()) {
                        this.classList.remove('error');
                        if (fieldLabel) fieldLabel.classList.remove('error');
                    }
                }, { once: true });
            } else {
                field.classList.remove('error');
                if (fieldLabel) fieldLabel.classList.remove('error');
            }
        });
        
        if (!isValid) {
            alert("Please fill in all required fields.");
            
            // Focus on the first error field
            const firstErrorField = currentStepElement.querySelector('.error');
            if (firstErrorField) firstErrorField.focus();
        }
        
        return isValid;
    }
}); 