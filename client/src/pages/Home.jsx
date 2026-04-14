import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';
import '../styles/Home.scss';

const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return;
    }
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      toast.error('Please provide both a Resume PDF and a Job Description.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const response = await api.post('/interview/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Analysis complete!');
        navigate(`/interview/${response.data.data._id}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to analyze resume.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section text-center">
        <h1 className="hero-title">
          Match Your Resume <br/> <span className="highlight"><Sparkles className="inline-icon" /> AI Powered Analysis</span>
        </h1>
        <p className="hero-subtitle">Upload your PDF resume and the job description. We'll identify skill gaps and generate a custom interview prep guide.</p>
      </div>

      <div className="analysis-card glass-panel">
        <form onSubmit={handleAnalyze}>
          
          <div className="form-section">
            <label>1. Job Description</label>
            <textarea 
              placeholder="Paste the target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
            />
          </div>

          <div className="form-section">
            <label>2. Upload Resume (PDF only, max 5MB)</label>
            <div className="file-upload-zone">
              <input 
                type="file" 
                accept="application/pdf"
                id="resume-upload"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="resume-upload" className="file-label">
                {file ? (
                  <div className="file-selected">
                    <FileText size={32} className="text-primary" />
                    <span>{file.name}</span>
                  </div>
                ) : (
                  <div className="file-empty">
                    <Upload size={32} className="text-secondary" />
                    <span>Click or drag to upload your PDF</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className="primary-btn analyze-btn" disabled={loading || !file || !jobDescription}>
            {loading ? <Loader2 className="spinner" size={20} /> : 'Generate Interview Prep & Analyze Fit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
