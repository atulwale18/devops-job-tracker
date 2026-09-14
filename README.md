# 🚀 DevOps Job Tracker

A full-stack job application tracking system designed and deployed using modern DevOps practices.

## 📌 Project Overview

DevOps Job Tracker helps users manage their job applications from a single dashboard.

Users can:

- Add job applications
- View applications
- Update application status
- Delete applications
- Search applications
- Filter applications by status
- View application statistics
- Open job links
- Add notes for each application

## 🏗️ Architecture

```text
                    GitHub
                       |
                       v
                    Jenkins
                       |
                       v
                    Docker
                       |
                       v
                    AWS EC2
                       |
              +--------+--------+
              |                 |
              v                 v
          React + Nginx     Node.js API
                                |
                                v
                            AWS RDS
                            MySQL
