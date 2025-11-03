import { useState, useEffect } from 'react';

/**
 * Hook to load supplemental materials (experiments, videos, activities) for a chapter
 * @param {number} chapterId - The chapter number
 * @param {number} grade - The grade level (default: 8)
 * @param {string} subject - The subject name (default: 'Physics')
 * @returns {object} { materials, loading, error }
 */
export function useSupplementalMaterials(chapterId, grade = 8, subject = 'Physics') {
  const [materials, setMaterials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMaterials() {
      try {
        setLoading(true);
        setError(null);
        
        // Try to load from JSON file
        const response = await fetch(
          `/data/supplemental/chapter${chapterId}-experiments.json`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to load: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMaterials(data);
      } catch (err) {
        console.warn(`Supplemental materials not found for chapter ${chapterId}:`, err);
        // Return empty structure if file doesn't exist
        setMaterials({
          chapterId,
          chapterTitle: '',
          experiments: [],
          videos: [],
          activities: []
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (chapterId) {
      loadMaterials();
    }
  }, [chapterId, grade, subject]);

  return { materials, loading, error };
}

