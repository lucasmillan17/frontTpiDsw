import { useForm } from "react-hook-form";
import Input from "../../shared/components/Input.jsx";

function RegisterForm() {
    const {
          register,
          handleSubmit,
          watch,
          formState: {errors} 
        } = useForm({mode: 'onChange'});
           
    const passwordValue = watch("password");

    const onSubmit = (data) => {
            console.log(data);
        };
    

        return (
            <form className="flex
            flex-col
            gap-4
            sm:gap-8
            p-8
            text-sm
            sm:text-base
            w-full
            max-w-sm
            mx-auto
            bg-white
            rounded-lg
            shadow-lg
            "
            onSubmit={handleSubmit(onSubmit)}>
                
                <Input label='Usuario'
                {...register('username',{
                    required: 'Usuario obligatorio'
                })}
                error={errors.username?.message}
                />

                <Input label='Email'
                {...register('email',{
                    required: 'Email obligatorio'
                })}
                error={errors.email?.message}/>

                <div className="
                    flex
                    flex-col
                    h-15
                    sm:h-20">
                <label>Rol</label>
                <select {...register('role',
                    {required : 'Debe especificar un rol'}
                )} className={`input-default $ {error ? 'border-red-500' : ''}`}>
                    <option value=""> Seleccione un rol...</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Cliente">Cliente</option>
                </select>
                {errors.role?.message && <p className="text-red-500 text-xs sm:text-sm">{errors.role?.message}</p>}
                </div>

                <Input
                label='Contraseña'
                type ='password'
                {...register('password',{
                    minLength:{
                        value: 8,
                        message: 'La contraseña debe tener al menos 8 caracteres'
                    }, required: 'Este campo es obligatorio'
                })}
                error={errors.password?.message}
                />

                <Input
                label='Confirmar contraseña'
                type='password'
                {...register('confirmPassword',{
                    validate: value =>
                        value === passwordValue || 'Las contraseñas no coinciden'
                })}
                error={errors.confirmPassword?.message}
                />

                <button type="submit">Registrar Usuario</button>
            </form>

        );


}

export default RegisterForm;