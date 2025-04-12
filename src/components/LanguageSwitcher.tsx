import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LanguageSwitcher Component
 * Renders buttons that allow the user to change the application's displayed language.
 * Uses the 'react-i18next' library for internationalization (i18n) functionality.
 */
function LanguageSwitcher() {
    // Get the i18n instance from the useTranslation hook.
    // The i18n instance holds the current language state and methods to change it.
    const { i18n } = useTranslation();

    /**
     * Changes the application's language using the i18n instance.
     * @param lng - The language code string (e.g., 'en', 'es', 'fr') to switch to.
     */
    const changeLanguage = (lng: string) => { 
        // Call the changeLanguage method on the i18n instance,
        // passing the desired language code. This triggers the library
        // to load the appropriate translations and re-render components.
        i18n.changeLanguage(lng);
    };

    // Render the language switching buttons
    return (
        <div>
            {/* Each button, when clicked, calls the changeLanguage function 
                with a specific language code string. */}
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('es')}>Español</button>
            <button onClick={() => changeLanguage('fr')}>Français</button>
        </div>
    );
}

// Export the component for use elsewhere in the application
export default LanguageSwitcher;