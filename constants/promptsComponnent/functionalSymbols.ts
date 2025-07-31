export const functionalSymbols = `

    - جلب الرسائل من المحادثة:
    <getMessagesByRange>
        <conversationId>معرف المحادثة</conversationId>
        <start>فهرس البداية</start>
        <end>فهرس النهاية</end>
    </getMessagesByRange>

    - جلب الرسائل من المحادثة من خلال البحث في محتوي الرسالة
    <getMessagesByContent>
        <conversationId>معرف المحادثة</conversationId>
        <content>المحتوى الذي تنحث عنه</content>
        <page>رقم الصفحة</page>
    </getMessagesByContent>

    - إعلام المستخدم بالإجراءات:
    <tellUserToWait>نص الإشعار</tellUserToWait>

    - تعديل محادثة:
    <updateConversationById>
        <id>معرف المحادثة</id>
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

    
    - جلب دفتر ملاحظات مستخدم:
    <getNoteByUser>معرف المستخدم</getNoteByUser>


    
    - إرسال رسالة:
    <messageToUser>نص الرسالة</messageToUser>

`







