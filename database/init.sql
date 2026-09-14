CREATE DATABASE IF NOT EXISTS job_tracker;

USE job_tracker;

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    location VARCHAR(150),
    status ENUM(
        'Applied',
        'Interview',
        'Selected',
        'Rejected'
    ) DEFAULT 'Applied',
    applied_date DATE,
    job_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO jobs
(company, position, location, status, applied_date, job_url, notes)
VALUES
(
    'TCS',
    'DevOps Engineer',
    'Pune',
    'Interview',
    '2026-09-01',
    'https://www.tcs.com',
    'Technical interview scheduled'
),
(
    'Infosys',
    'Cloud Engineer',
    'Bangalore',
    'Applied',
    '2026-09-03',
    'https://www.infosys.com',
    'Waiting for response'
),
(
    'Wipro',
    'DevOps Engineer',
    'Pune',
    'Rejected',
    '2026-08-25',
    'https://www.wipro.com',
    'Application rejected'
);
