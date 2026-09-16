import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        navigate('/');
      } else {
        await register(formData);
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      const errData = err.response?.data;
      if (typeof errData === 'object') {
        setError(Object.values(errData).flat().join(' '));
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* Toggle Buttons */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 text-center font-bold ${
            isLogin ? 'border-b-2 border-black text-black' : 'text-gray-400'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 text-center font-bold ${
            !isLogin ? 'border-b-2 border-black text-black' : 'text-gray-400'
          }`}
        >
          Register
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:outline-none focus:border-black"
            required
          />
        </div>

        {!isLogin && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:outline-none focus:border-black"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:outline-none focus:border-black"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl focus:outline-none focus:border-black"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition mt-4"
        >
          {isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
        </button>
      </form>
    </div>
  );
};

export default Login;