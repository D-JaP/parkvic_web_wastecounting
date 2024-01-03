# Use an official Python runtime as the base image
FROM public.ecr.aws/lambda/python:3.11



# Install the Python dependencies
RUN pip install stripe

# Copy the application code to the working directory
COPY . ./

# set port 
EXPOSE 8080

# Set the working directory in the container
WORKDIR /tmp
# Set the command to run the application
CMD ["Payment.lambda_handler"]
