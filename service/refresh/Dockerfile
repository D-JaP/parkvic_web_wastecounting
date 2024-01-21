# Use an official Python runtime as the base image
FROM public.ecr.aws/lambda/nodejs:20.2024.01.05.14



# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install 

# Copy the application files to the working directory
COPY . ./

# Set the working directory in the container
WORKDIR /tmp

# Expose a port (adjust based on your application's requirements)
EXPOSE 8080

# Define the command to run your application
CMD ["index.handler"]