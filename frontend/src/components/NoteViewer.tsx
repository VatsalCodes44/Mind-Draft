import { memo } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  EditorComposer,
  Editor,
  ToolbarPlugin,
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  FontFamilyDropdown,
  FontSizeDropdown,
  CodeFormatButton,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  UnderlineButton,
  Divider,
  InsertDropdown,
} from 'verbum';
import { editorState } from '../store/blogUpload/atom';

const NoteViewer= memo(() => {
  const setEditorState = useSetRecoilState(editorState)


    
  // const initialEditorState = (editor: LexicalEditor) => {
  //   const editorState = editor.parseEditorState(JSON.parse(a));
  //   editor.setEditorState(editorState);
  // };


  // initialEditorState={initialEditorState}


  return (
      <EditorComposer initialEditorState={()=>{}} >
        <Editor onChange={(editorState: string) =>{
          setEditorState(editorState)
          console.log(editorState)
        }} placeholder='Write your mind-draft...' 
        emojisEnabled={true} emojiPickerEnabled={true}
        >
          <ToolbarPlugin defaultFontSize="18px">
            <FontFamilyDropdown />
            <FontSizeDropdown />
            <Divider />
            <BoldButton />
            <ItalicButton />
            <UnderlineButton />
            <CodeFormatButton />
            <InsertLinkButton />
            <TextColorPicker />
            <BackgroundColorPicker />
            <TextFormatDropdown />
            <Divider />
            <AlignDropdown />
            <Divider />
            <InsertDropdown enableTable={true} enableYoutube={true}
            enableTwitter={true} enableImage={{enable:false, maxWidth: 0}}
            enableEquations={true} enableExcalidraw={false}
            enableHorizontalRule={true} enableStickyNote={true} enablePoll={false} />
          </ToolbarPlugin>
        </Editor>
      </EditorComposer>
  );
});
export default NoteViewer;
