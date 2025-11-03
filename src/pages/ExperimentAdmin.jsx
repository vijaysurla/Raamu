import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, X, Upload, ArrowLeft } from 'lucide-react';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import './ExperimentAdmin.css';

const experimentTypes = [
  { value: '3d-simulation', label: '3D Simulation' },
  { value: 'interactive-demo', label: 'Interactive Demo' },
  { value: 'video', label: 'Video Tutorial' },
  { value: 'quiz', label: 'Interactive Quiz' }
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner', color: 'success' },
  { value: 'intermediate', label: 'Intermediate', color: 'warning' },
  { value: 'advanced', label: 'Advanced', color: 'error' }
];

const controlTypes = [
  { value: 'slider', label: 'Slider' },
  { value: 'select', label: 'Dropdown' },
  { value: 'toggle', label: 'Toggle Switch' },
  { value: 'input', label: 'Text Input' }
];

export default function ExperimentAdmin() {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentExperiment, setCurrentExperiment] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    titleTelugu: '',
    description: '',
    descriptionTelugu: '',
    difficulty: 'beginner',
    estimatedTime: '',
    relatedPages: '',
    type: '3d-simulation',
    controls: [],
    measurements: []
  });

  const [newControl, setNewControl] = useState({
    id: '',
    label: '',
    labelTelugu: '',
    type: 'slider',
    min: 0,
    max: 100,
    default: 50,
    unit: '',
    options: []
  });

  const [newMeasurement, setNewMeasurement] = useState({
    id: '',
    label: '',
    labelTelugu: '',
    unit: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddControl = () => {
    if (!newControl.id || !newControl.label) {
      alert('Please fill in control ID and label');
      return;
    }

    setFormData({
      ...formData,
      controls: [...formData.controls, { ...newControl }]
    });

    setNewControl({
      id: '',
      label: '',
      labelTelugu: '',
      type: 'slider',
      min: 0,
      max: 100,
      default: 50,
      unit: '',
      options: []
    });
  };

  const handleRemoveControl = (index) => {
    setFormData({
      ...formData,
      controls: formData.controls.filter((_, i) => i !== index)
    });
  };

  const handleAddMeasurement = () => {
    if (!newMeasurement.id || !newMeasurement.label) {
      alert('Please fill in measurement ID and label');
      return;
    }

    setFormData({
      ...formData,
      measurements: [...formData.measurements, { ...newMeasurement }]
    });

    setNewMeasurement({
      id: '',
      label: '',
      labelTelugu: '',
      unit: ''
    });
  };

  const handleRemoveMeasurement = (index) => {
    setFormData({
      ...formData,
      measurements: formData.measurements.filter((_, i) => i !== index)
    });
  };

  const handleSaveExperiment = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in required fields');
      return;
    }

    const experiment = {
      ...formData,
      id: currentExperiment?.id || `exp-${Date.now()}`,
      relatedPages: formData.relatedPages.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
    };

    if (currentExperiment) {
      setExperiments(experiments.map(exp => 
        exp.id === currentExperiment.id ? experiment : exp
      ));
    } else {
      setExperiments([...experiments, experiment]);
    }

    setShowForm(false);
    setCurrentExperiment(null);
    setFormData({
      title: '',
      titleTelugu: '',
      description: '',
      descriptionTelugu: '',
      difficulty: 'beginner',
      estimatedTime: '',
      relatedPages: '',
      type: '3d-simulation',
      controls: [],
      measurements: []
    });
  };

  const handleEditExperiment = (experiment) => {
    setCurrentExperiment(experiment);
    setFormData({
      ...experiment,
      relatedPages: experiment.relatedPages.join(', ')
    });
    setShowForm(true);
  };

  const handleDeleteExperiment = (id) => {
    if (confirm('Are you sure you want to delete this experiment?')) {
      setExperiments(experiments.filter(exp => exp.id !== id));
    }
  };

  const exportToJSON = () => {
    const exportData = {
      chapterId: 1,
      chapterTitle: 'Force and Pressure',
      experiments: experiments
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chapter1-experiments.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="experiment-admin">
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1>Experiment Manager</h1>
            <p>Create and manage interactive experiments for Chapter 1</p>
          </div>
        </div>
        <div className="admin-actions">
          <Button variant="secondary" onClick={exportToJSON} disabled={experiments.length === 0}>
            <Upload size={20} />
            Export JSON
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={20} />
            New Experiment
          </Button>
        </div>
      </div>

      {/* Experiments List */}
      <div className="experiments-grid">
        {experiments.map((exp) => (
          <Card key={exp.id} className="experiment-card">
            <div className="card-header">
              <div>
                <h3>{exp.title}</h3>
                <p className="subtitle">{exp.titleTelugu}</p>
              </div>
              <Badge variant={difficultyLevels.find(d => d.value === exp.difficulty)?.color || 'default'}>
                {exp.difficulty}
              </Badge>
            </div>
            <div className="card-body">
              <p>{exp.description}</p>
              <div className="card-meta">
                <span>⏱️ {exp.estimatedTime}</span>
                <span>📖 Pages: {exp.relatedPages.join(', ')}</span>
                <span>🎮 {exp.type}</span>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <span className="stat-label">Controls</span>
                  <span className="stat-value">{exp.controls?.length || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Measurements</span>
                  <span className="stat-value">{exp.measurements?.length || 0}</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <Button variant="ghost" size="sm" onClick={() => handleEditExperiment(exp)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteExperiment(exp.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}

        {experiments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🧪</div>
            <h3>No experiments yet</h3>
            <p>Create your first experiment to get started</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus size={20} />
              Create Experiment
            </Button>
          </div>
        )}
      </div>

      {/* Experiment Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content experiment-form">
            <div className="modal-header">
              <h2>{currentExperiment ? 'Edit Experiment' : 'New Experiment'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Basic Info */}
              <section className="form-section">
                <h3>Basic Information</h3>
                
                <div className="form-group">
                  <label>Title (English) *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Friction Lab"
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label>Title (Telugu) *</label>
                  <input
                    type="text"
                    name="titleTelugu"
                    value={formData.titleTelugu}
                    onChange={handleInputChange}
                    placeholder="e.g., ఘర్షణ ప్రయోగశాల"
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label>Description (English) *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe what students will learn"
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label>Description (Telugu) *</label>
                  <textarea
                    name="descriptionTelugu"
                    value={formData.descriptionTelugu}
                    onChange={handleInputChange}
                    rows="3"
                    className="input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Difficulty *</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="input"
                    >
                      {difficultyLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Estimated Time *</label>
                    <input
                      type="text"
                      name="estimatedTime"
                      value={formData.estimatedTime}
                      onChange={handleInputChange}
                      placeholder="e.g., 10 minutes"
                      className="input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="input"
                    >
                      {experimentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Related Pages *</label>
                    <input
                      type="text"
                      name="relatedPages"
                      value={formData.relatedPages}
                      onChange={handleInputChange}
                      placeholder="e.g., 15, 16, 17"
                      className="input"
                    />
                  </div>
                </div>
              </section>

              {/* Controls */}
              <section className="form-section">
                <h3>Interactive Controls</h3>
                
                {formData.controls.length > 0 && (
                  <div className="items-list">
                    {formData.controls.map((control, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <strong>{control.label}</strong>
                          <span className="item-meta">
                            {control.type} • {control.unit}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveControl(index)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="add-item-form">
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="ID (e.g., force)"
                        value={newControl.id}
                        onChange={(e) => setNewControl({ ...newControl, id: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Label (English)"
                        value={newControl.label}
                        onChange={(e) => setNewControl({ ...newControl, label: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Label (Telugu)"
                        value={newControl.labelTelugu}
                        onChange={(e) => setNewControl({ ...newControl, labelTelugu: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <select
                        value={newControl.type}
                        onChange={(e) => setNewControl({ ...newControl, type: e.target.value })}
                        className="input"
                      >
                        {controlTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {newControl.type === 'slider' && (
                    <div className="form-row">
                      <input
                        type="number"
                        placeholder="Min"
                        value={newControl.min}
                        onChange={(e) => setNewControl({ ...newControl, min: parseInt(e.target.value) })}
                        className="input"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={newControl.max}
                        onChange={(e) => setNewControl({ ...newControl, max: parseInt(e.target.value) })}
                        className="input"
                      />
                      <input
                        type="number"
                        placeholder="Default"
                        value={newControl.default}
                        onChange={(e) => setNewControl({ ...newControl, default: parseInt(e.target.value) })}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={newControl.unit}
                        onChange={(e) => setNewControl({ ...newControl, unit: e.target.value })}
                        className="input"
                      />
                    </div>
                  )}

                  {newControl.type === 'select' && (
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Options (comma-separated)"
                        onChange={(e) => setNewControl({ 
                          ...newControl, 
                          options: e.target.value.split(',').map(opt => opt.trim()) 
                        })}
                        className="input"
                      />
                    </div>
                  )}

                  <Button size="sm" onClick={handleAddControl}>
                    <Plus size={16} />
                    Add Control
                  </Button>
                </div>
              </section>

              {/* Measurements */}
              <section className="form-section">
                <h3>Measurements (Output)</h3>
                
                {formData.measurements.length > 0 && (
                  <div className="items-list">
                    {formData.measurements.map((measurement, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <strong>{measurement.label}</strong>
                          <span className="item-meta">{measurement.unit}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMeasurement(index)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="add-item-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="ID (e.g., friction)"
                      value={newMeasurement.id}
                      onChange={(e) => setNewMeasurement({ ...newMeasurement, id: e.target.value })}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder="Label (English)"
                      value={newMeasurement.label}
                      onChange={(e) => setNewMeasurement({ ...newMeasurement, label: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Label (Telugu)"
                      value={newMeasurement.labelTelugu}
                      onChange={(e) => setNewMeasurement({ ...newMeasurement, labelTelugu: e.target.value })}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder="Unit (e.g., N, m/s)"
                      value={newMeasurement.unit}
                      onChange={(e) => setNewMeasurement({ ...newMeasurement, unit: e.target.value })}
                      className="input"
                    />
                  </div>

                  <Button size="sm" onClick={handleAddMeasurement}>
                    <Plus size={16} />
                    Add Measurement
                  </Button>
                </div>
              </section>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveExperiment}>
                <Save size={20} />
                Save Experiment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

