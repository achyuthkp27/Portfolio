import React, { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MasonryGridProps {
    children: ReactNode[];
    className?: string;
    gap?: number;
}

const MasonryGrid = ({ children, className = "", gap = 24 }: MasonryGridProps) => {
    const [columns, setColumns] = useState<ReactNode[][]>([]);

    useEffect(() => {
        const calculateColumns = () => {
            const width = window.innerWidth;
            let colCount = 1;
            if (width >= 1024) colCount = 3;
            else if (width >= 768) colCount = 2;

            const newColumns: ReactNode[][] = Array.from({ length: colCount }, () => []);

            React.Children.forEach(children, (child, index) => {
                if (child) {
                    newColumns[index % colCount].push(child);
                }
            });

            setColumns(newColumns);
        };

        calculateColumns();
        window.addEventListener('resize', calculateColumns);
        return () => window.removeEventListener('resize', calculateColumns);
    }, [children]);

    return (
        <div className={`flex gap-${gap / 4} ${className}`} style={{ gap: `${gap}px` }}>
            {columns.map((col, i) => (
                <div key={i} className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
                    {col.map((item, j) => (
                        <motion.div
                            key={j}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: (j * 0.1) + (i * 0.05) }}
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {item}
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MasonryGrid;
