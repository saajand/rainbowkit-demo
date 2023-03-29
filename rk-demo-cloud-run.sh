#!/usr/bin/bash

### Deployment to Google Cloud Run
rm -rf ./build
yarn run build
docker build -t  asia.gcr.io/<project>/<package-name>:<tag> .
docker push  asia.gcr.io/<project>/<package>:<tag>
gcloud run deploy <package-name-with-tag> --image asia.gcr.io/<project>/<package>:<tag> --region=us-central1 --max-instances=1 --platform managed --allow-unauthenticated --port=80 --timeout=3600 --memory=512Mi --cpu 1 --project=<project>
