import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../../app/services/authService";
import { SignupParams } from "../../../app/services/authService/signup";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../app/hooks/useAuth";

const schema = z.object({
    name: z.string().nonempty("Nome é obrigatório").min(1),
    email: z
        .string()
        .nonempty("E-mail é obrigatório")
        .email("Informe um e-mail válido")
        .min(1),
    password: z
        .string()
        .nonempty("Senha é obrigatória")
        .min(8, "Senha deve conter pelo menos 8 dígitos"),
});

export function useRegisterController() {
    const {
        register,
        handleSubmit: hookFormSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async (data: SignupParams) => {
            return authService.signup(data);
        },
    });

    const { signin } = useAuth();

    const handleSubmit = hookFormSubmit(async (data) => {
        try {
            const { accessToken } = await mutateAsync(data);

            signin(accessToken);
        } catch {
            toast.error("Ocorreu um erro ao criar a sua conta!");
        }
    });

    return { register, handleSubmit, errors, isLoading };
}
