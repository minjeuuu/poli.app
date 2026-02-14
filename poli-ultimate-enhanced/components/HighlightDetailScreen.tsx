// components/HighlightDetailScreen.tsx

import React, { useEffect, useState } from 'react';
import { HighlightedEntity, HighlightDetail } from '../types';
import { fetchHighlightDetail } from '../services/homeService';
import { ArrowLeft, BookOpen, Link as LinkIcon, Share2, Bookmark, Check } from 'lucide-react';

type Props = {
  highlightId: string;
  onBack: () => void;
};

const HighlightDetailScreen: React.FC<Props> = ({ highlightId, onBack }) => {
  const [highlight, setHighlight] = useState<HighlightDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHighlight = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHighlightDetail(highlightId);
        setHighlight(data);
      } catch (err) {
        setError('Failed to load highlight.');
      } finally {
        setLoading(false);
      }
    };

    loadHighlight();
  }, [highlightId]);

  if (loading) return <div>Loading highlight...</div>;
  if (error) return <div>{error}</div>;
  if (!highlight) return <div>No highlight found.</div>;

  return (
    <div className="highlight-detail-screen">
      <header>
        <button onClick={onBack}><ArrowLeft /></button>
        <h1>Highlight Detail</h1>
      </header>
      <main>
        <article>
          <h2>{highlight.author}</h2>
          <p>{highlight.text}</p>
        </article>
        {highlight.relatedEntities.length > 0 && (
          <section>
            <h3>Related Entities</h3>
            <ul>
              {highlight.relatedEntities.map((entity: HighlightedEntity) => (
                <li key={entity.id}>
                  <BookOpen /> {entity.text} ({entity.type})
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <footer>
        <button><Bookmark /></button>
        <button><Share2 /></button>
        <button><Check /></button>
        <button><LinkIcon /></button>
      </footer>
    </div>
  );
};

export default HighlightDetailScreen;