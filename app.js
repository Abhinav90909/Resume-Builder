// Resume Maker - Main JavaScript
class ResumeMaker {
    constructor() {
        this.resumeData = this.getDefaultData();
        this.currentTemplate = 'classic';
        this.accentColor = '#2563eb';
        this.zoomLevel = 1;
        this.autosaveInterval = null;

        this.initializeElements();
        this.bindEvents();
        this.loadFromStorage();
        this.initializeSections();
        this.switchTemplate(this.currentTemplate); // Initialize with default template
        this.updatePreview();
        this.startAutosave();
    }

    // Initialize DOM elements
    initializeElements() {
        // Form elements
        this.form = document.getElementById('resumeForm');
        this.templateSelect = document.getElementById('templateSelect');
        this.accentColorInput = document.getElementById('accentColor');
        this.photoInput = document.getElementById('photo');
        this.photoPreview = document.getElementById('photoPreview');
        this.removePhotoBtn = document.getElementById('removePhoto');

        // Action buttons
        this.downloadPDFBtn = document.getElementById('downloadPDF');
        this.downloadHTMLBtn = document.getElementById('downloadHTML');
        this.saveDataBtn = document.getElementById('saveData');
        this.loadDataBtn = document.getElementById('loadData');
        this.exportJSONBtn = document.getElementById('exportJSON');
        this.importFileInput = document.getElementById('importFile');

        // Preview controls
        this.zoomInBtn = document.getElementById('zoomIn');
        this.zoomOutBtn = document.getElementById('zoomOut');
        this.resetZoomBtn = document.getElementById('resetZoom');
        this.resumePreview = document.getElementById('resumePreview');

        // Section containers
        this.sectionContainers = {
            experience: document.getElementById('experienceList'),
            education: document.getElementById('educationList'),
            skills: document.getElementById('skillsList'),
            projects: document.getElementById('projectsList'),
            certifications: document.getElementById('certificationsList'),
            languages: document.getElementById('languagesList')
        };
    }

    // Bind event listeners
    bindEvents() {
        // Form events
        this.form.addEventListener('input', (e) => this.handleFormInput(e));
        this.form.addEventListener('change', (e) => this.handleFormChange(e));

        // Template and color changes
        this.templateSelect.addEventListener('change', (e) => this.handleTemplateChange(e));
        this.accentColorInput.addEventListener('input', (e) => this.handleColorChange(e));

        // Photo upload
        this.photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        this.removePhotoBtn.addEventListener('click', () => this.handlePhotoRemove());

        // Action buttons
        this.downloadPDFBtn.addEventListener('click', () => this.downloadPDF());
        this.downloadHTMLBtn.addEventListener('click', () => this.downloadHTML());
        this.saveDataBtn.addEventListener('click', () => this.saveToStorage());
        this.loadDataBtn.addEventListener('click', () => this.loadDataBtn.click());
        this.exportJSONBtn.addEventListener('click', () => this.exportJSON());

        // File import
        this.importFileInput.addEventListener('change', (e) => this.handleFileImport(e));

        // Preview controls
        this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        this.resetZoomBtn.addEventListener('click', () => this.resetZoom());

        // Dynamic section events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-item')) {
                const section = e.target.closest('.add-item').dataset.section;
                this.addSectionItem(section);
            }
            if (e.target.closest('.remove-item')) {
                const item = e.target.closest('.dynamic-item');
                this.removeSectionItem(item);
            }
            if (e.target.closest('.move-up')) {
                const item = e.target.closest('.dynamic-item');
                this.moveSectionItem(item, -1);
            }
            if (e.target.closest('.move-down')) {
                const item = e.target.closest('.dynamic-item');
                this.moveSectionItem(item, 1);
            }
            if (e.target.closest('.toggle-section')) {
                const section = e.target.closest('.toggle-section').dataset.section;
                this.toggleSection(section);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Prevent form submission
        this.form.addEventListener('submit', (e) => e.preventDefault());
    }

    // Handle form input changes
    handleFormInput(e) {
        const { name, value } = e.target;
        this.updateData(name, value);
        this.updatePreview();
    }

    // Handle form changes (selects, checkboxes, etc.)
    handleFormChange(e) {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        this.updateData(name, finalValue);
        this.updatePreview();
    }

    // Handle template change
    handleTemplateChange(e) {
        this.currentTemplate = e.target.value;
        this.switchTemplate(this.currentTemplate);
        this.updatePreview();
        this.saveToStorage();
    }

    // Handle color change
    handleColorChange(e) {
        this.accentColor = e.target.value;
        document.documentElement.style.setProperty('--primary-color', this.accentColor);
        this.updatePreview();
        this.saveToStorage();
    }

    // Handle photo upload
    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.updateData('photo', e.target.result);
                this.photoPreview.src = e.target.result;
                this.photoPreview.style.display = 'block';
                this.photoPreview.parentElement.classList.add('has-image');
                this.removePhotoBtn.style.display = 'flex';
                this.updatePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle photo removal
    handlePhotoRemove() {
        this.updateData('photo', '');
        this.photoInput.value = '';
        this.photoPreview.src = '';
        this.photoPreview.style.display = 'none';
        this.photoPreview.parentElement.classList.remove('has-image');
        this.removePhotoBtn.style.display = 'none';
        this.updatePreview();
    }

    // Handle file import
    handleFileImport(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.resumeData = { ...this.getDefaultData(), ...data };
                    this.populateForm();
                    this.updatePreview();
                    this.saveToStorage();
                    this.showNotification('Data imported successfully!', 'success');
                } catch (error) {
                    this.showNotification('Error importing data. Please check the file format.', 'error');
                }
            };
            reader.readAsText(file);
        }
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.saveToStorage();
                    break;
                case 'p':
                    e.preventDefault();
                    this.downloadPDF();
                    break;
                case 'e':
                    e.preventDefault();
                    this.exportJSON();
                    break;
            }
        }
    }

    // Update data object
    updateData(key, value) {
        if (key.includes('.')) {
            const keys = key.split('.');
            let obj = this.resumeData;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) obj[keys[i]] = {};
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
        } else {
            this.resumeData[key] = value;
        }
    }

    // Get form data
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            if (value.trim()) {
                data[key] = value;
            }
        }

        // Get dynamic section data
        Object.keys(this.sectionContainers).forEach(section => {
            data[section] = this.getSectionData(section);
        });

        return data;
    }

    // Get section data
    getSectionData(section) {
        const container = this.sectionContainers[section];
        const items = container.querySelectorAll('.dynamic-item');
        return Array.from(items).map(item => {
            const inputs = item.querySelectorAll('input, textarea, select');
            const itemData = {};
            inputs.forEach(input => {
                if (input.value.trim()) {
                    itemData[input.name] = input.value;
                }
            });
            return itemData;
        }).filter(item => Object.keys(item).length > 0);
    }

    // Update preview
    updatePreview() {
        this.resumePreview.innerHTML = this.generateResumeHTML();
        this.applyTemplateStyling();
        this.applyZoom();
    }

    // Generate resume HTML
    generateResumeHTML() {
        const data = this.resumeData;
        const template = this.currentTemplate;

        return `
            <div class="resume ${template}" id="resumeContent">
                ${this.generateHeaderHTML(data)}
                ${this.generateContactHTML(data)}
                ${data.summary ? this.generateSummaryHTML(data.summary) : ''}
                ${this.generateSectionHTML('experience', data.experience, this.getExperienceHTML.bind(this))}
                ${this.generateSectionHTML('education', data.education, this.getEducationHTML.bind(this))}
                ${this.generateSectionHTML('skills', data.skills, this.getSkillsHTML.bind(this))}
                ${this.generateSectionHTML('projects', data.projects, this.getProjectsHTML.bind(this))}
                ${this.generateSectionHTML('certifications', data.certifications, this.getCertificationsHTML.bind(this))}
                ${this.generateSectionHTML('languages', data.languages, this.getLanguagesHTML.bind(this))}
            </div>
        `;
    }

    // Generate header HTML
    generateHeaderHTML(data) {
        const photoHTML = data.photo ? `<img src="${data.photo}" alt="Profile Photo" class="profile-photo">` : '';
        return `
            <div class="resume-header">
                ${photoHTML}
                <div class="header-text">
                    <h1>${data.fullName || 'Your Name'}</h1>
                    <h2 class="job-title">${data.jobTitle || 'Your Job Title'}</h2>
                </div>
            </div>
        `;
    }

    // Generate contact HTML
    generateContactHTML(data) {
        const contactItems = [];

        if (data.email) contactItems.push(`<div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>`);
        if (data.phone) contactItems.push(`<div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>`);
        if (data.location) contactItems.push(`<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.location}</div>`);
        if (data.website) contactItems.push(`<div class="contact-item"><i class="fas fa-globe"></i> ${data.website}</div>`);
        if (data.linkedin) contactItems.push(`<div class="contact-item"><i class="fab fa-linkedin"></i> ${data.linkedin}</div>`);

        return contactItems.length ? `<div class="contact-info">${contactItems.join('')}</div>` : '';
    }

    // Generate summary HTML
    generateSummaryHTML(summary) {
        return `
            <div class="resume-section">
                <h2>Summary</h2>
                <p class="summary-text">${summary}</p>
            </div>
        `;
    }

    // Generate section HTML
    generateSectionHTML(section, data, itemRenderer) {
        if (!data || !data.length) return '';

        const itemsHTML = data.map(item => itemRenderer(item)).join('');
        const sectionTitles = {
            experience: 'Experience',
            education: 'Education',
            skills: 'Skills',
            projects: 'Projects',
            certifications: 'Certifications',
            languages: 'Languages'
        };

        return `
            <div class="resume-section">
                <h2>${sectionTitles[section]}</h2>
                <div class="section-content">
                    ${itemsHTML}
                </div>
            </div>
        `;
    }

    // Get experience item HTML
    getExperienceHTML(exp) {
        return `
            <div class="section-item">
                <div class="item-header">
                    <div class="item-title">${exp.position || 'Position'}</div>
                    <div class="item-subtitle">${exp.company || 'Company'}</div>
                </div>
                <div class="item-meta">${exp.startDate || ''} - ${exp.endDate || 'Present'} ${exp.location ? `• ${exp.location}` : ''}</div>
                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
            </div>
        `;
    }

    // Get education item HTML
    getEducationHTML(edu) {
        return `
            <div class="section-item">
                <div class="item-header">
                    <div class="item-title">${edu.degree || 'Degree'}</div>
                    <div class="item-subtitle">${edu.institution || 'Institution'}</div>
                </div>
                <div class="item-meta">${edu.graduationDate || ''} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
                ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
            </div>
        `;
    }

    // Get skills HTML
    getSkillsHTML(skills) {
        const skillsList = skills.map(skill => skill.name || skill).filter(Boolean);
        if (!skillsList.length) return '';

        return `
            <div class="section-item">
                <div class="skills-list">
                    ${skillsList.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Get projects HTML
    getProjectsHTML(project) {
        return `
            <div class="section-item">
                <div class="item-header">
                    <div class="item-title">${project.name || 'Project Name'}</div>
                    <div class="item-subtitle">${project.technologies || ''}</div>
                </div>
                <div class="item-meta">${project.startDate || ''} - ${project.endDate || 'Present'} ${project.url ? `• <a href="${project.url}" target="_blank">View Project</a>` : ''}</div>
                ${project.description ? `<p class="item-description">${project.description}</p>` : ''}
            </div>
        `;
    }

    // Get certifications HTML
    getCertificationsHTML(cert) {
        return `
            <div class="section-item">
                <div class="item-header">
                    <div class="item-title">${cert.name || 'Certification Name'}</div>
                    <div class="item-subtitle">${cert.issuer || 'Issuer'}</div>
                </div>
                <div class="item-meta">${cert.date || ''} ${cert.expiry ? `• Expires: ${cert.expiry}` : ''}</div>
                ${cert.credentialId ? `<p class="item-description">Credential ID: ${cert.credentialId}</p>` : ''}
            </div>
        `;
    }

    // Get languages HTML
    getLanguagesHTML(lang) {
        return `
            <div class="section-item">
                <div class="item-header">
                    <div class="item-title">${lang.name || 'Language'}</div>
                    <div class="item-subtitle">${lang.proficiency || 'Proficiency Level'}</div>
                </div>
            </div>
        `;
    }

    // Apply template styling
    applyTemplateStyling() {
        // Apply accent color
        document.documentElement.style.setProperty('--primary-color', this.accentColor);

        // Add template-specific styling
        const resumeElement = this.resumePreview.querySelector('.resume');
        if (resumeElement) {
            resumeElement.className = `resume ${this.currentTemplate}`;
        }
    }

    // Apply zoom level
    applyZoom() {
        this.resumePreview.style.transform = `scale(${this.zoomLevel})`;
    }

    // Switch template stylesheets
    switchTemplate(template) {
        // Disable all template stylesheets
        const templateLinks = document.querySelectorAll('link[id$="-template"]');
        templateLinks.forEach(link => {
            link.disabled = true;
        });

        // Enable the selected template stylesheet
        const selectedLink = document.getElementById(`${template}-template`);
        if (selectedLink) {
            selectedLink.disabled = false;
        }
    }

    // Initialize dynamic sections
    initializeSections() {
        Object.keys(this.sectionContainers).forEach(section => {
            this.addSectionItem(section); // Add at least one item to each section
        });
    }

    // Add section item
    addSectionItem(section) {
        const container = this.sectionContainers[section];
        const itemHTML = this.getSectionItemHTML(section);
        container.insertAdjacentHTML('beforeend', itemHTML);
    }

    // Get section item HTML
    getSectionItemHTML(section) {
        const templates = {
            experience: `
                <div class="dynamic-item">
                    <div class="dynamic-item-header">
                        <input type="text" name="position" placeholder="Position/Job Title" class="item-title-input">
                        <div class="item-actions">
                            <button type="button" class="btn-icon btn-small move-up" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                            <button type="button" class="btn-icon btn-small move-down" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                            <button type="button" class="btn-icon btn-small remove-item" title="Remove"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <input type="text" name="company" placeholder="Company/Organization">
                    <div class="item-dates">
                        <input type="text" name="startDate" placeholder="Start Date">
                        <input type="text" name="endDate" placeholder="End Date">
                        <input type="text" name="location" placeholder="Location">
                    </div>
                    <textarea name="description" placeholder="Job description and achievements..." rows="3"></textarea>
                </div>
            `,
            education: `
                <div class="dynamic-item">
                    <div class="dynamic-item-header">
                        <input type="text" name="degree" placeholder="Degree/Program" class="item-title-input">
                        <div class="item-actions">
                            <button type="button" class="btn-icon btn-small move-up" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                            <button type="button" class="btn-icon btn-small move-down" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                            <button type="button" class="btn-icon btn-small remove-item" title="Remove"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <input type="text" name="institution" placeholder="Institution/School">
                    <div class="item-dates">
                        <input type="text" name="graduationDate" placeholder="Graduation Date">
                        <input type="text" name="gpa" placeholder="GPA">
                    </div>
                    <textarea name="description" placeholder="Relevant coursework, honors, activities..." rows="2"></textarea>
                </div>
            `,
            skills: `
                <div class="dynamic-item">
                    <div class="dynamic-item-header">
                        <input type="text" name="name" placeholder="Skill" class="item-title-input">
                        <div class="item-actions">
                            <button type="button" class="btn-icon btn-small move-up" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                            <button type="button" class="btn-icon btn-small move-down" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                            <button type="button" class="btn-icon btn-small remove-item" title="Remove"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `,
            projects: `
                <div class="dynamic-item">
                    <div class="dynamic-item-header">
                        <input type="text" name="name" placeholder="Project Name" class="item-title-input">
                        <div class="item-actions">
                            <button type="button" class="btn-icon btn-small move-up" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                            <button type="button" class="btn-icon btn-small move-down" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                            <button type="button" class="btn-icon btn-small remove-item" title="Remove"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <input type="text" name="technologies" placeholder="Technologies Used">
                    <div class="item-dates">
                        <input type="text" name="startDate" placeholder="Start Date">
                        <input type="text" name="endDate" placeholder="End Date">
                        <input type="url" name="url" placeholder="Project URL">
                    </div>
                    <textarea name="description" placeholder="Project description and your contributions..." rows="3"></textarea>
                </div>
            `,
            certifications: `
                <div class="dynamic-item">
                    <div class="dynamic-item-header">
                        <input type="text" name="name" placeholder="Certification Name" class="item-title-input">
                        <div class="item-actions">
                            <button type="button" class="btn-icon btn-small move-up" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                            <button type="button" class="btn-icon btn-small move-down" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                            <button type="button" class="btn-icon btn-small remove-item" title="Remove"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <input type="text" name="issuer" placeholder="Issuing Organization">
                    <div class="item-dates">
                        <input type="text" name="date" placeholder="Date Obtained">
                        <input type="text" name="expiry" placeholder="Expiry Date">
                        <input type="text" name="credentialId" placeholder="Credential ID">
                    </div>
                </div>
            `,
            languages: `
                <div class="dynamic-item">
                    <div class="dynamic-item-header">
                        <input type="text" name="name" placeholder="Language" class="item-title-input">
                        <div class="item-actions">
                            <button type="button" class="btn-icon btn-small move-up" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                            <button type="button" class="btn-icon btn-small move-down" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                            <button type="button" class="btn-icon btn-small remove-item" title="Remove"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <select name="proficiency" class="proficiency-select">
                        <option value="">Select Proficiency</option>
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                    </select>
                </div>
            `
        };

        return templates[section] || '';
    }

    // Remove section item
    removeSectionItem(item) {
        if (item.parentElement.children.length > 1) {
            item.remove();
            this.updatePreview();
        } else {
            this.showNotification('Cannot remove the last item in a section.', 'warning');
        }
    }

    // Move section item
    moveSectionItem(item, direction) {
        const container = item.parentElement;
        const items = Array.from(container.children);
        const currentIndex = items.indexOf(item);
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < items.length) {
            if (direction > 0) {
                container.insertBefore(item, items[newIndex].nextSibling);
            } else {
                container.insertBefore(item, items[newIndex]);
            }
            this.updatePreview();
        }
    }

    // Toggle section visibility
    toggleSection(section) {
        const sectionElement = document.querySelector(`[data-section="${section}"]`);
        const content = sectionElement.querySelector('.section-content');
        const toggleBtn = sectionElement.querySelector('.toggle-section i');

        if (content.style.display === 'none') {
            content.style.display = 'flex';
            toggleBtn.className = 'fas fa-chevron-up';
        } else {
            content.style.display = 'none';
            toggleBtn.className = 'fas fa-chevron-down';
        }
    }

    // Zoom controls
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
        this.applyZoom();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
        this.applyZoom();
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.applyZoom();
    }

    // Download as PDF
    async downloadPDF() {
        this.showNotification('Generating PDF...', 'info');

        const element = document.getElementById('resumeContent');
        const opt = {
            margin: 0.5,
            filename: `${this.resumeData.fullName || 'resume'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
            this.showNotification('PDF downloaded successfully!', 'success');
        } catch (error) {
            this.showNotification('Error generating PDF. Please try again.', 'error');
        }
    }

    // Download as HTML
    downloadHTML() {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.resumeData.fullName || 'Resume'}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        ${this.getTemplateCSS()}
    </style>
</head>
<body>
    ${this.generateResumeHTML()}
</body>
</html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.resumeData.fullName || 'resume'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('HTML file downloaded successfully!', 'success');
    }

    // Get template CSS
    getTemplateCSS() {
        // This would include all the CSS for the selected template
        // For brevity, I'll include a condensed version
        return `
            :root {
                --primary-color: ${this.accentColor};
                --font-sans: 'Inter', sans-serif;
                --font-display: 'Poppins', sans-serif;
                --font-serif: 'Merriweather', serif;
            }

            body { margin: 0; font-family: var(--font-sans); }
            .resume { max-width: 8.5in; min-height: 11in; margin: 0 auto; padding: 0.75in; background: white; }
            .resume h1 { margin-bottom: 0.25rem; }
            .resume h2 { margin: 1.5rem 0 0.5rem 0; }
            /* Add more template-specific styles here */
        `;
    }

    // Export as JSON
    exportJSON() {
        const dataStr = JSON.stringify(this.resumeData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.resumeData.fullName || 'resume'}_data.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('JSON file exported successfully!', 'success');
    }

    // LocalStorage methods
    saveToStorage() {
        try {
            localStorage.setItem('resumeData', JSON.stringify(this.resumeData));
            localStorage.setItem('resumeTemplate', this.currentTemplate);
            localStorage.setItem('resumeAccentColor', this.accentColor);
            this.showNotification('Data saved successfully!', 'success');
        } catch (error) {
            this.showNotification('Error saving data. Storage might be full.', 'error');
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('resumeData');
            const template = localStorage.getItem('resumeTemplate');
            const color = localStorage.getItem('resumeAccentColor');

            if (data) {
                this.resumeData = { ...this.getDefaultData(), ...JSON.parse(data) };
                this.populateForm();
            }

            if (template) {
                this.currentTemplate = template;
                this.templateSelect.value = template;
                this.switchTemplate(template);
            }

            if (color) {
                this.accentColor = color;
                this.accentColorInput.value = color;
                document.documentElement.style.setProperty('--primary-color', color);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    // Populate form with data
    populateForm() {
        Object.keys(this.resumeData).forEach(key => {
            const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
            if (element && this.resumeData[key]) {
                if (element.type === 'file') {
                    // Handle photo separately
                    if (key === 'photo' && this.resumeData[key]) {
                        this.photoPreview.src = this.resumeData[key];
                        this.photoPreview.style.display = 'block';
                        this.photoPreview.parentElement.classList.add('has-image');
                        this.removePhotoBtn.style.display = 'flex';
                    }
                } else {
                    element.value = this.resumeData[key];
                }
            }
        });

        // Populate dynamic sections
        Object.keys(this.sectionContainers).forEach(section => {
            const container = this.sectionContainers[section];
            container.innerHTML = '';

            const sectionData = this.resumeData[section] || [];
            sectionData.forEach(itemData => {
                const itemHTML = this.getSectionItemHTML(section);
                container.insertAdjacentHTML('beforeend', itemHTML);

                // Populate the item with data
                const lastItem = container.lastElementChild;
                Object.keys(itemData).forEach(key => {
                    const input = lastItem.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = itemData[key];
                    }
                });
            });

            // Add at least one item if none exist
            if (!sectionData.length) {
                this.addSectionItem(section);
            }
        });
    }

    // Get default data structure
    getDefaultData() {
        return {
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            summary: '',
            photo: '',
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            languages: []
        };
    }

    // Start autosave
    startAutosave() {
        this.autosaveInterval = setInterval(() => {
            this.saveToStorage();
        }, 30000); // Autosave every 30 seconds
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-size: 14px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Get notification color
    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resumeMaker = new ResumeMaker();
});

// Add CSS for notifications
const notificationStyles = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .notification i {
        font-size: 16px;
    }
`;

// Inject notification styles
const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);
