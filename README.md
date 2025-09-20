# Resume Maker

A modern, responsive resume builder web application that allows users to create professional resumes with live preview, multiple templates, and export options.

## Features

### 🎨 **Design & Layout**
- **Two-pane responsive layout**: Form inputs on the left, live preview on the right
- **Multiple templates**: Classic, Modern, and Creative designs
- **Real-time preview**: See changes instantly as you type
- **Responsive design**: Works perfectly on desktop, tablet, and mobile
- **Custom accent colors**: Personalize your resume with your brand colors

### 📝 **Resume Sections**
- Personal Information (name, title, contact details, photo)
- Professional Summary
- Work Experience
- Education
- Skills
- Projects
- Certifications
- Languages

### 💾 **Data Management**
- **Auto-save**: Your work is automatically saved every 30 seconds
- **Manual save/load**: Save and restore your resume data
- **JSON import/export**: Share and backup your resume data
- **LocalStorage persistence**: Your data persists between sessions

### 📄 **Export Options**
- **PDF Download**: High-quality PDF with exact preview styling
- **HTML Download**: Standalone HTML file for web sharing
- **Print-friendly**: Optimized styles for printing

### ♿ **Accessibility**
- Semantic HTML structure
- ARIA roles and labels
- Keyboard navigation support
- WCAG contrast compliance
- Screen reader friendly

### 🎯 **User Experience**
- **Dynamic sections**: Add, remove, and reorder resume sections
- **Form validation**: Required field indicators
- **Photo upload**: Add a professional headshot
- **Zoom controls**: Adjust preview size for better viewing
- **Template switching**: Change designs without losing data
- **Progress indicators**: Visual feedback for all actions

## Quick Start

1. **Open the application**: Simply open `index.html` in your web browser
2. **Fill in your information**: Use the form on the left to enter your details
3. **See live preview**: Watch your resume update in real-time on the right
4. **Choose a template**: Select from Classic, Modern, or Creative designs
5. **Customize colors**: Pick an accent color that matches your style
6. **Download your resume**: Export as PDF or HTML when ready

## Usage Guide

### Adding Information

1. **Personal Details**: Start with your name, job title, and contact information
2. **Professional Summary**: Write a compelling summary of your experience
3. **Experience**: Add your work history with company names, dates, and descriptions
4. **Education**: Include your degrees, institutions, and graduation dates
5. **Skills**: List your technical and soft skills
6. **Projects**: Showcase your personal or professional projects
7. **Certifications**: Add relevant certifications and credentials
8. **Languages**: Specify languages and proficiency levels

### Managing Sections

- **Add items**: Click the "+" button to add new entries to any section
- **Remove items**: Click the trash icon to delete unwanted entries
- **Reorder items**: Use the up/down arrows to rearrange items
- **Collapse sections**: Click the chevron to hide/show sections

### Templates

#### Classic Template
- Traditional, professional design
- Serif typography for a formal look
- Clean layout with clear hierarchy
- Perfect for corporate and traditional industries

#### Modern Template
- Contemporary, clean design
- Sans-serif typography
- Card-based layout with subtle shadows
- Great for tech and creative industries

#### Creative Template
- Bold, eye-catching design
- Gradient backgrounds and modern effects
- Glass-morphism styling
- Ideal for creative professionals and designers

### Export Options

#### PDF Export
- High-quality PDF generation
- Matches the live preview exactly
- Optimized for printing and digital sharing
- Includes all styling and formatting

#### HTML Export
- Standalone HTML file
- Can be hosted online or shared via email
- Includes all fonts and styling
- Responsive design maintained

#### Print
- Print-friendly CSS included
- Optimized layouts for paper printing
- Clean, professional appearance

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save resume data
- **Ctrl/Cmd + P**: Download PDF
- **Ctrl/Cmd + E**: Export JSON data

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No frameworks, pure ES6+ code
- **LocalStorage API**: Client-side data persistence
- **HTML2PDF.js**: Client-side PDF generation
- **Google Fonts**: Professional typography

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### File Structure
```
resume-maker/
├── index.html          # Main HTML file
├── styles.css          # Main stylesheet
├── app.js              # Main JavaScript functionality
├── templates/          # Template-specific styles
│   ├── classic.css
│   ├── modern.css
│   └── creative.css
└── README.md           # This documentation
```

### Performance Features
- **Lazy loading**: Templates load only when selected
- **Efficient updates**: Minimal DOM manipulation
- **Optimized images**: Photo upload with compression
- **Smooth animations**: Hardware-accelerated transitions

## Customization

### Adding New Templates

1. Create a new CSS file in the `templates/` directory
2. Follow the existing template structure
3. Add the template option to the HTML select element
4. Update the JavaScript template handling

### Styling Customization

- Modify CSS variables in `styles.css` for global changes
- Edit template files for design-specific changes
- Update color schemes and typography as needed

### Adding New Sections

1. Add the section to the HTML form
2. Create the section container in JavaScript
3. Add the rendering logic for the preview
4. Update the data structure and persistence

## Troubleshooting

### Common Issues

**Preview not updating**
- Check browser console for JavaScript errors
- Ensure all required fields are filled
- Try refreshing the page and reloading data

**PDF export not working**
- Ensure html2pdf.js is loaded correctly
- Check browser permissions for downloads
- Try a different browser if issues persist

**Data not saving**
- Check if LocalStorage is enabled in browser
- Clear browser cache and try again
- Check available storage space

**Template not changing**
- Verify template files are in the correct location
- Check browser console for CSS loading errors
- Ensure template names match exactly

### Browser-Specific Notes

**Chrome**: Full feature support, recommended browser
**Firefox**: Excellent support, some minor CSS differences
**Safari**: Good support, ensure latest version
**Edge**: Full support, same as Chrome

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support and questions:
- Check the troubleshooting section above
- Ensure you're using a supported browser
- Try clearing your browser cache
- Check the browser console for error messages

## Credits

- **Fonts**: Google Fonts (Inter, Poppins, Merriweather)
- **Icons**: Font Awesome
- **PDF Generation**: HTML2PDF.js
- **Design Inspiration**: Modern resume design principles

---

**Happy resume building!** 🎉
