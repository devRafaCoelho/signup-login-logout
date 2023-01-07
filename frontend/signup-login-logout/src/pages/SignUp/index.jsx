import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import api from '../../services/api';

export default function RegisterPage() {
    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        email: yup.string().email().required("Email is required!"),
        password: yup.string().min(4).max(10).required("Password is required!"),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null]).required("Password is required!")
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate();

    async function onSubmit(data) {
        try {
            const response = await api.post('/user', {
                name: data.name,
                email: data.email,
                password: data.password
            })
            console.log(response.data);

            navigate('/login');
        } catch (error) {
            console.log(error.response.data);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>SignUp</h1>

            <>
                <label htmlFor="name">Name</label>
                <input
                    name="name"
                    type="text"
                    placeholder={errors.name?.message}
                    {...register("name")}
                />
            </>

            <>
                <label htmlFor="email">E-mail</label>
                <input
                    name="email"
                    type="email"
                    placeholder={errors.email?.message}
                    {...register("email")}
                />
            </>

            <>
                <label htmlFor="password">Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder={errors.password?.message}
                    {...register("password")}
                />
            </>

            <>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />
            </>

            <button>SignUp</button>

            <p>
                Already registered? <Link to='/login'>LogIn!</Link>
            </p>
        </form>
    );
}