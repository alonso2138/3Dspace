export default class LoadColors {
    constructor() {        
        // Generate the HTML and inject styles
        this.LoadColors();
    }

    async LoadColors() {
        try {
            const response = await fetch('/datos/marcas.json');
            const jsonData = await response.json();

            // Instantiate this with data from JSON
            this.paleta = {
                ParentHover: jsonData.paleta.ParentHover,
                ParentSelected: jsonData.paleta.ParentSelected,
                Parent: jsonData.paleta.Parent,
                CustomHover: jsonData.paleta.CustomHover,
                CustomSelected: jsonData.paleta.CustomSelected,
                Custom: jsonData.paleta.Custom,
                ButtonHover: jsonData.paleta.ButtonHover,
                ButtonSelected: jsonData.paleta.ButtonSelected,
                Button: jsonData.paleta.Button,
                TextHighlight: jsonData.paleta.TextHighlight,
                Text: jsonData.paleta.Text,
                Topnav: jsonData.paleta.Topnav,
                TopnavButton: jsonData.paleta.TopnavButton,
                TopnavButtonHover: jsonData.paleta.TopnavButtonHover,
                InfoBoxBackground: jsonData.paleta.InfoBoxBackground,
                InfoBoxButton: jsonData.paleta.InfoBoxButton,
                InfoBoxButtonHover: jsonData.paleta.InfoBoxButtonHover,
                InfoBoxButtonSelected: jsonData.paleta.InfoBoxButtonSelected
            };

            this.setCSSVariables();
        } catch (error) {
            console.error('Error loading colors data:', error);
        }
    }

    setCSSVariables() {
        const root = document.documentElement;
        root.style.setProperty('--ParentHover', this.paleta.ParentHover);
        root.style.setProperty('--ParentSelected', this.paleta.ParentSelected);
        root.style.setProperty('--Parent', this.paleta.Parent);
        root.style.setProperty('--CustomHover', this.paleta.CustomHover);
        root.style.setProperty('--CustomSelected', this.paleta.CustomSelected);
        root.style.setProperty('--Custom', this.paleta.Custom);
        root.style.setProperty('--ButtonHover', this.paleta.ButtonHover);
        root.style.setProperty('--ButtonSelected', this.paleta.ButtonSelected);
        root.style.setProperty('--Button', this.paleta.Button);
        root.style.setProperty('--TextHighlight', this.paleta.TextHighlight);
        root.style.setProperty('--Text', this.paleta.Text);
        root.style.setProperty('--Topnav', this.paleta.Topnav);
        root.style.setProperty('--TopnavButton', this.paleta.TopnavButton);
        root.style.setProperty('--TopnavButtonHover', this.paleta.TopnavButtonHover);
        root.style.setProperty('--InfoBoxBackground', this.paleta.InfoBoxBackground);
        root.style.setProperty('--InfoBoxButton', this.paleta.InfoBoxButton);
        root.style.setProperty('--InfoBoxButtonHover', this.paleta.InfoBoxButtonHover);
        root.style.setProperty('--InfoBoxButtonSelected', this.paleta.InfoBoxButtonSelected);
    }
}