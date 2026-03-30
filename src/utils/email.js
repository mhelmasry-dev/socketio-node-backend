import nodemailer from "nodemailer"; // استيراد مكتبة nodemailer لإرسال البريد الإلكتروني

// دالة لإرسال بريد إلكتروني
async function sendEmail({
    to,      // عنوان البريد الإلكتروني للمستلم
    cc,      // عناوين البريد الإلكتروني للنسخة الكربونية
    bcc,     // عناوين البريد الإلكتروني للنسخة الكربونية المخفية
    subject, // موضوع البريد الإلكتروني
    html,    // محتوى البريد الإلكتروني بصيغة HTML
    attachments = [], // المرفقات، بشكل افتراضي تكون فارغة إذا لم تُحدد
} = {}) {

    // إعداد النقل أو التوصيل لإرسال البريد باستخدام خدمة Gmail
    let transporter = nodemailer.createTransport({
        service: "gmail", // استخدام خدمة Gmail
        auth: {
            user: "01140775155ss@gmail.com",  // عنوان البريد الإلكتروني الذي سيرسل منه
            pass: "bial jsqz cfsy qhko",      // كلمة المرور الخاصة بحساب Gmail
        },
        tls: {
            rejectUnauthorized: false, // تجاوز التحقق من الشهادة (يستخدم عادةً مع Gmail)
        },
    });

    // إرسال البريد باستخدام كائن النقل المُعرف
    let info = await transporter.sendMail({
        from: `"Mohammed elmasry company" <${process.env.GMAIL}>`, // عنوان المرسل (يُفضل استخدام متغيرات البيئة)
        to,        // المستلم (يتم تمريرها من الدالة)
        cc,        // نسخة كربونية (يتم تمريرها من الدالة)
        bcc,       // نسخة كربونية مخفية (يتم تمريرها من الدالة)
        subject,   // موضوع البريد (يتم تمريره من الدالة)
        html,      // محتوى البريد بصيغة HTML (يتم تمريره من الدالة)
        attachments, // المرفقات (يتم تمريرها من الدالة)
    });

    // التحقق من إرسال البريد بنجاح، إذا كان هناك عناوين بريد مرفوضة، تُرجع الدالة false
    return info.rejected.length ? false : true;
}

export default sendEmail; // تصدير الدالة لاستخدامها في أماكن أخرى
