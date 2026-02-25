import { useState, useEffect } from 'react';

export function useImagePreloader(frameCount: number, pathPrefix: string, extension: string = 'webp') {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const imgArray: HTMLImageElement[] = [];
        let loaded = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Zero-pad the frame index to 4 digits (e.g., 0001, 0015, 0178)
            const paddedIndex = i.toString().padStart(4, '0');
            const src = `${pathPrefix}frame_${paddedIndex}.${extension}`;

            img.onload = () => {
                if (!isMounted) return;
                loaded++;
                setLoadedCount(loaded);
                if (loaded === frameCount) {
                    setIsReady(true);
                }
            };

            img.onerror = () => {
                if (!isMounted) return;
                console.error(`Failed to load frame: ${src}`);
                // Consider it "loaded" so we don't hang indefinitely on a single missing frame
                loaded++;
                setLoadedCount(loaded);
                if (loaded === frameCount) {
                    setIsReady(true);
                }
            };

            img.src = src;
            imgArray.push(img);
        }

        setImages(imgArray);

        return () => {
            isMounted = false;
        };
    }, [frameCount, pathPrefix, extension]);

    return { images, loadedCount, progress: loadedCount / frameCount, isReady };
}
