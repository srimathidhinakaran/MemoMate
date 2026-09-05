import React from 'react';
import { useParams, Link } from 'react-router-dom';
import CaregiverDashboard from './CaregiverDashboard';
import { ArrowLeft } from 'lucide-react';

const CaregiverUserDetails = () => {
  const { userId } = useParams();

  return (
    <div className="page-view animate-fade-in">
      <Link to="/caregiver" className="btn-secondary" style={{ width: 'fit-content', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={18} />
        <span>Back to Caregiver Overview</span>
      </Link>
      <CaregiverDashboard initialUserId={userId} />
    </div>
  );
};

export default CaregiverUserDetails;
