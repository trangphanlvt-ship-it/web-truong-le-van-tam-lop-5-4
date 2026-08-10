import React, { useState, useEffect } from 'react';
import { CLASS_ACTIVITIES } from '../data/classData';
import { getClassActivities } from '../lib/supabase';
import { Camera, Calendar, Award, Sparkles } from 'lucide-react';

export default function ClassActivities() {
  const [activities, setActivities] = useState(CLASS_ACTIVITIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadActivities() {
      setLoading(true);
      try {
        const sbActs = await getClassActivities();
        if (sbActs && sbActs.length > 0) {
          setActivities(sbActs);
        }
      } catch (err) {
        console.warn('Activities note:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadActivities();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        color: 'white',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '32px',
        boxShadow: '0 10px 25px rgba(217, 119, 6, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            <Camera size={16} /> Phong Trào & Sự Kiện
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            🎨 HOẠT ĐỘNG NỔI BẬT LỚP 5/4
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '4px' }}>
            Trường TH Lê Văn Tám • GVCN: PHAN THỊ DIỄM TRANG • Năm học 2025 - 2026
          </p>
        </div>

        <div style={{ fontSize: '2.5rem' }}>
          📸 🏆 ✨
        </div>
      </div>

      {/* Activities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {activities.map(act => (
          <div
            key={act.id}
            style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease'
            }}
          >
            <div style={{ position: 'relative', height: '200px', backgroundColor: '#f1f5f9' }}>
              <img
                src={act.image_url || act.image || '/assets/images/school_banner.jpg'}
                alt={act.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'assets/images/school_banner.jpg'; }}
              />
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.75)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '14px',
                fontSize: '0.78rem',
                fontWeight: '700',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Calendar size={13} /> {act.event_date || act.date || '2025-2026'}
              </span>
            </div>

            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                {act.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
                {act.description || act.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
