document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('qualification-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-bar .step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const charCount = document.getElementById('charCount');
    const caseDetails = document.getElementById('caseDetails');
    
    let currentStep = 1;
    
    showStep(currentStep);
    
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep === 1) {
                const firstNameField = document.getElementById('firstName');
                const lastNameField = document.getElementById('lastName');
                const emailField = document.getElementById('email');
                const phoneField = document.getElementById('phone');
                const caseTypeSelect = document.getElementById('caseType');
                
                let emptyFields = [];
                let isValid = true;
                
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
                
                if (!isValid) {
                    alert(`Please fill in the following required fields: ${emptyFields.join(', ')}`);
                    
                    const firstErrorField = document.querySelector('.form-step[data-step="1"] .error');
                    if (firstErrorField) firstErrorField.focus();
                    
                    return;
                }
                
                [firstNameField, lastNameField, emailField, phoneField, caseTypeSelect].forEach(field => {
                    field.addEventListener('input', function() {
                        if (this.value.trim()) {
                            this.classList.remove('error');
                            const label = document.querySelector(`label[for="${this.id}"]`);
                            if (label) label.classList.remove('error');
                        }
                    }, { once: true });
                });
                
                goToNextStep();
            } else {
                if (validateStep(currentStep)) {
                    goToNextStep();
                }
            }
        });
    });
    
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToPreviousStep();
        });
    });
    
    if (caseDetails && charCount) {
        const maxChars = 500;
        
        caseDetails.addEventListener('input', () => {
            const currentLength = caseDetails.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > maxChars) {
                caseDetails.value = caseDetails.value.substring(0, maxChars);
                charCount.textContent = maxChars;
            }
            
            if (currentLength >= maxChars * 0.8) {
                charCount.style.color = '#f44336';
            } else {
                charCount.style.color = '#777';
            }
        });
        
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
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                currentStep = 4;
                showStep(currentStep);
                
                const progressBar = document.querySelector('.progress-bar');
                progressBar.classList.add('completed');
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
    
    const caseTypeSelect = document.getElementById('caseType');
    const caseQuestionSections = document.querySelectorAll('.case-questions');
    const caseTypeTitle = document.getElementById('case-type-title');
    
    if (caseTypeSelect) {
        caseTypeSelect.addEventListener('change', function() {
            const selectedCaseType = this.value;
            
            if (caseTypeTitle) {
                const selectedOptionText = this.options[this.selectedIndex].text;
                caseTypeTitle.textContent = selectedOptionText + ' Case Details';
            }
            
            caseQuestionSections.forEach(section => {
                section.style.display = 'none';
                
                const requiredFields = section.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    field.disabled = true;
                });
            });
            
            const selectedSection = document.getElementById(`${selectedCaseType}-questions`);
            if (selectedSection) {
                selectedSection.style.display = 'block';
                
                const requiredFields = selectedSection.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    field.disabled = false;
                });
            }
        });
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
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
        
        phoneInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                const inputEvent = new Event('input');
                this.dispatchEvent(inputEvent);
            }, 0);
        });
    }
    
    function showStep(stepNumber) {
        steps.forEach(step => {
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
        currentStepElement.style.display = 'block';
        
        void currentStepElement.offsetWidth;
        
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
        
        if (stepNumber === 2) {
            const visibleCaseSection = currentStepElement.querySelector('.case-questions[style="display: block;"]');
            if (visibleCaseSection) {
                requiredFields = visibleCaseSection.querySelectorAll('[required]:not([disabled])');
            } else {
                alert("Please select a case type on the previous step.");
                return false;
            }
        } else {
            requiredFields = currentStepElement.querySelectorAll('[required]:not([disabled])');
        }
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            const fieldLabel = document.querySelector(`label[for="${field.id}"]`);
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                if (fieldLabel) fieldLabel.classList.add('error');
                
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
            
            const firstErrorField = currentStepElement.querySelector('.error');
            if (firstErrorField) firstErrorField.focus();
        }
        
        return isValid;
    }
}); 