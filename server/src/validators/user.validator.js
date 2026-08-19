const {z}=require("zod")

const usernameSchema=z.string()
                      .trim()
                      .min(1,"Username required")
const emailSchema=z.string()
                      .trim()
                      .email()
                      .min(1,"Email required")
const passwordSchema = z.string()
                        .trim()
                        .min(8, "Password must contain at least 8 characters")
                        .regex(/[A-Z]/, "Add at least one uppercase letter")
                        .regex(/[a-z]/, "Add at least one lowercase letter")
                        .regex(/[0-9]/, "Add at least one number")
                        .regex(/[@$!%*?&]/, "Add at least one special character");
const roleSchema=z.string()
                      .trim()
                      .min(1,"Role required")

const UserRegisterSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema.optional()
});
module.exports={
    UserRegisterSchema
}