import dynamic from 'next/dynamic';

const TextEditor = dynamic(() => import('./TextEditor'), { ssr: false });

export default TextEditor;
