// Simple Resume Maker - Test Version
console.log('Simple Resume Maker JavaScript loaded successfully!');

class SimpleResumeMaker {
    constructor() {
        console.log('SimpleResumeMaker constructor called');
        this.initializeElements();
        this.bindEvents();
        this.updatePreview();
    }

    initializeElements() {
        console.log('Initializing elements...');
        this.form = document.getElementById('resumeForm');
        this.templateSelect = document.getElementById('templateSelect');
        this.resumePreview = document.getElementById('resumePreview');

        if (!this.form) console.error('Form not found!');
        if (!this.templateSelect) console.error('Template select not found!');
        if (!this.resumePreview) console.error('Resume preview not found!');
    }

    bindEvents() {
        console.log('Binding events...');
        if (this.templateSelect) {
            this.templateSelect.addEventListener('change', (e) => {
                console.log('Template changed to:', e.target.value);
                this.updatePreview();
            });
        }

        if (this.form) {
            this.form.addEventListener('input', (e) => {
                console.log('Form input changed:', e.target.name, e.target.value);
                this.updatePreview();
            });
        }
    }

    updatePreview() {
        console.log('Updating preview...');
        if (this.resumePreview) {
            const name = document.getElementById('fullName')?.value || 'Your Name';
            const title = document.getElementById('jobTitle')?.value || 'Your Job Title';

            this.resumePreview.innerHTML = `
                <div class="resume">
                    <h1>${name}</h1>
                    <h2>${title}</h2>
                    <p>Resume preview is working!</p>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - initializing app...');
    window.simpleResumeMaker = new SimpleResumeMaker();
});
