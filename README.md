# Ortografia Catalana

This project aims to help children learn Catalan orthography through interactive word selection exercises.

## Technology Stack

This project is built using the following technologies:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
- **JSON**: Used for storing orthographic rules and word examples.

## How to Run This Project

To run this project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/rubenlupi/ortografia-catalana.git
   cd ortografia-catalana
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open your browser and navigate to `localhost:5173/` to see the application running.

## JSON File Structure

The project uses a JSON file to store orthographic rules and word examples. The structure of the JSON file is as follows:

- `links`: An array of objects containing external links related to orthographic rules.
  - `title`: The title of the link.
  - `description`: A brief description of the link.
  - `url`: The URL of the link.
- `rules`: An array of objects containing orthographic rules.
  - `id`: A unique identifier for the rule.
  - `message`: A description of the rule.
  - `rule`: The rule in a concise format.
  - `ex`: Examples of words that follow the rule.
- `words`: An array of objects containing words and their incorrect variants.
  - `word`: The correct word.
  - `wrongVariants`: An array of incorrect variants of the word.
  - `level`: The difficulty level of the word.
  - `rule`: The ID of the rule that applies to the word.
  - `meaning`: A brief definition of the word, explaining its usage or significance.
  - `sentence`: An example sentence showcasing the correct usage of the word in context.

### Possibilities for Modifications

- Add new orthographic rules and examples.
- Update existing rules and examples.
- Remove outdated or incorrect rules and examples.
- Add new external links related to orthographic rules.

## Requesting Modifications Through a PR

To request modifications to the JSON file:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make the necessary modifications to the JSON file.
4. Commit your changes and push them to your forked repository.
5. Create a pull request (PR) to the main repository with a description of your changes.

The project maintainers will review your PR and merge it if the changes are appropriate.

## Author

This project is maintained by [rubenlupi](https://github.com/rubenlupi).
