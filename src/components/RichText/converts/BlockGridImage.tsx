import { JSXConverters } from "@payloadcms/richtext-lexical/react";
import {
  SerializedListItemNode,
  SerializedBlockNode,
} from "@payloadcms/richtext-lexical";
import styles from "../style.module.css";

type CustomSerializedBlockNode = SerializedBlockNode;

// (Opcional) Extiende el tipo para tener un autocompletado más preciso
