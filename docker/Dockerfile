FROM n8nio/n8n:latest

USER root
RUN mkdir -p /home/node/.n8n/custom-modules
WORKDIR /home/node/.n8n/custom-modules
RUN npm install mammoth pdf-to-img --no-save
USER node