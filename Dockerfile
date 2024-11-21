FROM node

# Copy the packa.gejson and package-lock.json files
COPY package*.json ./

# Install the dependencies
# RUN npm install

# Copy the app files
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]