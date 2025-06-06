import FeatureCard from './FeatureCard';
import { FaLock, FaTrash, FaKey, FaEdit } from 'react-icons/fa';

export default function FeaturesSection() {
const features = [
{
icon: <FaLock />,
title: 'Encrypted Notes',
description: 'Your notes are encrypted before they leave your device for maximum security.',
},
{
icon: <FaKey />,
title: 'OTP Verification',
description: 'Secure user authentication using email-based OTP verification.',
},
{
icon: <FaTrash />,
title: 'Trash Bin',
description: 'Deleted notes are soft-deleted to your trash for recovery.',
},
{
icon: <FaEdit />,
title: 'Simple Note Management',
description: 'Create, edit, and organize notes with tags, privacy and expiry control.',
},
];

return (
<section className="py-20 px-6 md:px-16 bg-gray-100">
<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
Features That Matter
</h2>
<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
{features.map((f, index) => (
<FeatureCard key={index} icon={f.icon} title={f.title} description={f.description} />
))}
</div>
</section>
);
}