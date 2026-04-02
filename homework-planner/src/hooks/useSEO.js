import { useEffect } from 'react';

/**
 * Custom hook to manage page-specific SEO metadata.
 * @param {Object} options - SEO options
 * @param {string} options.title - The page title
 * @param {string} options.description - The page description
 * @param {string} options.keywords - Supplemental keywords for this page
 */
export default function useSEO({ title, description, keywords }) {
    useEffect(() => {
        // Update Title
        const baseTitle = 'StudyNext';
        document.title = title ? `${title} | ${baseTitle}` : baseTitle;

        // Update Description
        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                metaDescription.content = description;
                document.head.appendChild(metaDescription);
            }

            // Sync with OG and Twitter
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
            document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', description);
        }

        // Update Title in Social Tags
        if (title) {
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${title} | ${baseTitle}`);
            document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', `${title} | ${baseTitle}`);
        }

        // Update Keywords
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            const baseKeywords = "homework planner, student planner, school planner, study planner";
            const combinedKeywords = `${baseKeywords}, ${keywords}`;

            if (metaKeywords) {
                metaKeywords.setAttribute('content', combinedKeywords);
            } else {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                metaKeywords.content = combinedKeywords;
                document.head.appendChild(metaKeywords);
            }
        }
    }, [title, description, keywords]);
}
