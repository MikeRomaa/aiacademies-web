// pages/feedback.tsx
import React, { useState } from 'react';
import { NextPage } from 'next';
import { PageHeader } from '~/components/PageHeader';
import { Button } from '~/components/Button';
import axios from 'axios';

const Feedback: NextPage = () => {
    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedback(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/`, {
                feedback,
                email,
            });

            setSuccessMessage('Thank you for your feedback!');
            setFeedback('');
            setEmail('');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('There was an error submitting your feedback. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <>
            <PageHeader title="Feedback" />
            <div className="container py-10">
                <h1 className="text-2xl font-semibold mb-4">We Value Your Feedback</h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Your Email (optional)</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="feedback" className="block text-gray-700 mb-2">Your Feedback</label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={handleFeedbackChange}
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            required
                        />
                    </div>
                    {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                    <Button type="submit" className="bg-deepblue-500 text-white font-medium">Submit Feedback</Button>
                </form>
            </div>
        </>
    );
};

export default Feedback;
