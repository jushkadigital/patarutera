

import { JSXConverters } from '@payloadcms/richtext-lexical/react';
import { SerializedListItemNode } from '@payloadcms/richtext-lexical';

// (Opcional) Extiende el tipo para tener un autocompletado más preciso
interface CustomSerializedListItemNode extends SerializedListItemNode {
  iconType?: 'check' | 'star' | 'arrow';
}

// Componente simple para renderizar el ícono (puedes usar SVGs, <img> o una librería de íconos)
const Icon = ({ type }: { type: string }) => {
  switch (type) {
    case 'check':
      return <span className="icon">✅</span>;
    case 'nocheck':
      return <span className="icon">❌</span>;
    case 'location':
      return <span className="icon">📍</span>;
    case 'circle':
      return <span className="icon">🔵</span>;
    default:
      return null; // No renderizar nada si no hay un iconType válido
  }
};

export const customListItemConverter: JSXConverters<CustomSerializedListItemNode> = {
  'custom-list-item': ({ node, nodesToJSX }) => {
    // Accedemos directamente a la propiedad personalizada 'iconType' desde el objeto 'node'
    const { iconType } = node;

    return (
      <li className={`list-item-with-icon icon-${iconType || 'default'}`}>
        {/* Renderiza el componente de ícono si iconType existe */}
        {iconType && <Icon type={iconType} />}
        
        {/* Renderiza el contenido del texto del list item */}
        <span className="list-item-text">
          {nodesToJSX({ parent: node, nodes: node.children })}
        </span>
      </li>
    );
  }
};