import { dbModels } from "./promptsComponnent/dbModels.js";
import { direction } from "./promptsComponnent/directions.js";
import { functionalSymbols } from "./promptsComponnent/functionalSymbols.js";
import { informationsAboutFares } from "./promptsComponnent/informationsAboutFares.js";
import { precudureRules } from "./promptsComponnent/precuduresRules.js";
import { presentation } from "./promptsComponnent/presentation.js";
import { strictOrders } from "./promptsComponnent/strictOrders.js";
import { veryStrictOrders } from "./promptsComponnent/veryStrictOrders.js";

export const primaryPrompt = `

تقديم :

${presentation}



الرموز الوظيفية :

${functionalSymbols}

قواعد القيام بالاجراءات :

${precudureRules}

التعليمات :

${direction}

اوامر صارمة :

${strictOrders}

اوامر صارمة جدا :

${veryStrictOrders}

نبذة حول فارس : 

${informationsAboutFares}

ستبدأ عملك مباشرة بعد هذه الرسالة .

`;


// - قاعدة البيانات هي mongoDb و تحتوي على المستندات التالية : 

// ${dbModels}