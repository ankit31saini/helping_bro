import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Download, ChevronLeft, Award, AlertTriangle, FileQuestion, Users, RefreshCw } from 'lucide-react';
import '../styles/Interview.scss';

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get(`/interview/${id}`);
        if (data.success) {
          setReport(data.data);
        }
      } catch (error) {
        toast.error('Failed to load interview report');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      toast.loading('Generating Optimized PDF...', { id: 'pdf-toast' });
      
      const response = await api.get(`/interview/generate-pdf/${id}`, {
        responseType: 'blob' // Important for file downloads
      });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Optimized-Resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success('Successfully downloaded!', { id: 'pdf-toast' });
    } catch (error) {
      toast.error('Failed to generate PDF', { id: 'pdf-toast' });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="interview-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ChevronLeft size={20} /> Back to Dashboard
      </button>

      <div className="header-actions">
        <h1>Analysis Results</h1>
        <button 
          className="primary-btn download-btn" 
          onClick={handleDownloadPDF} 
          disabled={downloading}
        >
          {downloading ? <RefreshCw className="spin" size={20} /> : <Download size={20} />}
          {downloading ? ' Generating...' : ' Download suggestions'}
        </button>
      </div>

      <div className="report-grid">
        {/* Score & Summary */}
        <div className="glass-panel score-card">
          <div className="score-header">
            <Award size={28} className="text-primary" />
            <h2>Match Score</h2>
          </div>
          <div className="score-display">
            <span className="score-number">{report.matchScore}%</span>
          </div>
          <p className="summary-text">{report.summary}</p>
        </div>

        {/* Skill Gaps */}
        <div className="glass-panel gaps-card">
          <div className="card-header">
            <AlertTriangle size={24} className="text-error" />
            <h2>Identified Skill Gaps</h2>
          </div>
          <div className="tag-cloud">
            {(report.skillGaps || []).map((gap, index) => (
              <span key={index} className="tag tag-red">{gap}</span>
            ))}
            {(!report.skillGaps || report.skillGaps.length === 0) && (
              <p>No major skill gaps identified!</p>
            )}
          </div>
        </div>

        {/* Technical Questions */}
        <div className="glass-panel list-card">
          <div className="card-header">
            <FileQuestion size={24} className="text-primary" />
            <h2>Technical Questions to Prepare</h2>
          </div>
          <ul className="question-list">
            {(report.technicalQuestions || []).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>

        {/* Behavioral Questions */}
        <div className="glass-panel list-card">
          <div className="card-header">
            <Users size={24} className="text-success" />
            <h2>Behavioral Insights</h2>
          </div>
          <ul className="question-list">
            {(report.behavioralQuestions || []).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
        
        {/* Recommendations */}
        <div className="glass-panel list-card full-width">
          <div className="card-header">
            <h2>Recommendations for Interview</h2>
          </div>
          <ul className="question-list">
            {(report.recommendations || []).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Interview;
