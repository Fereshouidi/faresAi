export const functionalSymbols = `
    - إرسال رسالة:
    <messageToUser>نص الرسالة</messageToUser>

    - جلب دفتر ملاحظات مستخدم:
    <getNoteByUser>userId</getNoteByUser>

    - تعديل دفتر ملاحظات:
    <updateNoteById>
        <id>noteId</id>
        <data>updated note</data>
    </updateNoteById>

    - جلب الرسائل من المحادثة:
    <getMessagesByRange>
        <conversationId>conversationId</conversationId>
        <start>index</start>
        <end>index</end>
    </getMessagesByRange>

    - جلب الرسائل من المحادثة من خلال البحث في محتوي الرسالة
    <getMessagesByContent>
        <conversationId>id</conversationId>
        <content>key words</content>
    </getMessagesByContent>

    - إعلام المستخدم بالإجراءات:
    <tellUserToWait>نص الإشعار</tellUserToWait>

    - تعديل محادثة:
    <updateConversationById>
        <id>conversationId</id>
        <data>object of updated conversation data (not json) ( it must start with "{" and end with "}" without spaces or new lines , be carefull) </data>
    </updateConversationById>

`;



`

    - إنشاء دفتر ملاحظات:
    <createNote>
        <userId>id</userId>
        <content>string</content>
    </createNote>


    تدوين ملاحظة جديدة حول العميل :

    <addNote>
        <noteId>هنا تضع معرف الملاحظة التي ستظيف لها الملاحظة الجديدة</noteId>
        <newNote>هنا ستكتب بيانات الملاحظة الجدية بالتنسيق التالي { title: string, text: string } </newNote>
    </addNote>
`