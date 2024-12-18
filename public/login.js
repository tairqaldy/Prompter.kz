// login.js

document.getElementById('login-btn').addEventListener('click', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const termsAccepted = document.getElementById('terms-checkbox').checked;
  
    if (!email || !password) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }
  
    if (!termsAccepted) {
      alert('Пожалуйста, примите условия использования.');
      return;
    }
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Успешный вход.');
        window.location.href = 'index.html';
      } else {
        alert(data.message || 'Ошибка при входе.');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка сервера.');
    }
  });
  
  document.getElementById('signup-btn').addEventListener('click', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const termsAccepted = document.getElementById('signup-terms-checkbox').checked;
  
    if (!name || !email || !password) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }
  
    if (!termsAccepted) {
      alert('Пожалуйста, примите условия использования.');
      return;
    }
  
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, terms: termsAccepted })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Успешная регистрация.');
        window.location.href = 'index.html';
      } else {
        alert(data.message || 'Ошибка при регистрации.');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка сервера.');
    }
  });
  
  app.post('/api/signup', async (req, res) => {
    const { name, email, password, terms } = req.body;
  
    if (!name || !email || !password || !terms) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все поля и примите условия.' });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
      }
  
      const newUser = new User({ name, email, password });
      await newUser.save();
  
      // Создание сессии
      req.session.userId = newUser._id;
      res.status(201).json({ message: 'Пользователь успешно зарегистрирован.' });
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      res.status(500).json({ message: 'Ошибка сервера.', error: error.message }); // Добавьте `error.message` для подробностей
    }
  });
  
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password ) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все поля.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Неверный email или пароль.' });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный email или пароль.' });
      }
  
      // Создание сессии
      req.session.userId = user._id;
      res.status(200).json({ message: 'Успешный вход.' });
    } catch (error) {
      console.error('Ошибка при входе:', error);
      res.status(500).json({ message: 'Ошибка сервера.', error: error.message }); // Добавьте `error.message` для подробностей
    }
  });
  