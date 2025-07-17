

import { JSXConverters } from '@payloadcms/richtext-lexical/react';
import { SerializedListItemNode } from '@payloadcms/richtext-lexical';
import styles from "../style.module.css"

// (Opcional) Extiende el tipo para tener un autocompletado más preciso
interface CustomSerializedListItemNode extends SerializedListItemNode {
  iconType?: 'check' | 'star' | 'arrow';
}

// Componente simple para renderizar el ícono (puedes usar SVGs, <img> o una librería de íconos)
function IconSelector(type:string)  {
  const classText = 'list_item_with_icon'
  console.log(type)

  switch (type) {
    case 'check':
      return classText+"_check"
    case 'nocheck':
      return classText+"_nocheck"
    case 'location':
      return classText+"_location"
    case 'circle':
      return classText+"_circle"
    default:
      return ''
  }
};

export const customListItemConverter: JSXConverters<CustomSerializedListItemNode> = {
  'custom-list-item': ({ node, nodesToJSX }) => {
    // Accedemos directamente a la propiedad personalizada 'iconType' desde el objeto 'node'
    const { iconType } = node;

    if(iconType){
      
      return (
      <li className={`${styles['list_item_with_icon']} ${styles[IconSelector(iconType)]}`}>
        {/* Renderiza el componente de ícono si iconType existe */}
          {nodesToJSX({ parent: node, nodes: node.children })}
      </li>
    );
    }else{
return (
      <li className={``}>
        {/* Renderiza el componente de ícono si iconType existe */}
          {nodesToJSX({ parent: node, nodes: node.children })}
      </li>
    );
    }
  }
};