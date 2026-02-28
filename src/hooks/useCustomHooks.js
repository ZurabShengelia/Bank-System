import { useState, useEffect } from 'react';
import {
  apiGetUser,
  apiGetTransactions,
  apiGetDailyLimits,
  apiGetSavingsGoals,
  apiGetNotifications,
  apiGetCreditScore,
} from '../services/apiService';
export const useAnimatedCounter = (targetValue, duration = 1000) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let animationId;
    let elapsed = 0;
    const frameRate = 1000 / 60;
    const incrementPerFrame = targetValue / (duration / frameRate);
    const animate = () => {
      elapsed += frameRate;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.floor(targetValue * progress));
      if (progress < 1) {
        animationId = setTimeout(animate, frameRate);
      }
    };
    animate();
    return () => clearTimeout(animationId);
  }, [targetValue, duration]);
  return displayValue;
};
export const useUserData = (username) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await apiGetUser(username);
        if (response.success) {
          setUserData(response.data.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (username) {
      fetchUser();
    }
  }, [username]);
  return { userData, loading, error };
};
export const useTransactions = (username) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refetch = async () => {
    setLoading(true);
    try {
      const response = await apiGetTransactions(username);
      if (response.success) {
        setTransactions(response.data.data || []);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (username) {
      refetch();
    }
  }, [username]);
  return { transactions, loading, error, refetch };
};
export const useDailyLimits = (username) => {
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refetch = async () => {
    setLoading(true);
    try {
      const response = await apiGetDailyLimits(username);
      if (response.success) {
        setLimits(response.data.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (username) {
      refetch();
    }
  }, [username]);
  return { limits, loading, error, refetch };
};
export const useSavingsGoals = (username) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refetch = async () => {
    setLoading(true);
    try {
      const response = await apiGetSavingsGoals(username);
      if (response.success) {
        setGoals(response.data.data || []);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (username) {
      refetch();
    }
  }, [username]);
  return { goals, loading, error, refetch };
};
export const useNotifications = (username) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refetch = async () => {
    setLoading(true);
    try {
      const response = await apiGetNotifications(username);
      if (response.success) {
        setNotifications(response.data.data || []);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (username) {
      refetch();

      const interval = setInterval(refetch, 10000);
      return () => clearInterval(interval);
    }
  }, [username]);
  return { notifications, loading, error, refetch };
};
export const useCreditScore = (username) => {
  const [score, setScore] = useState(750);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      try {
        const response = await apiGetCreditScore(username);
        if (response.success) {
          setScore(response.data.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (username) {
      fetchScore();
    }
  }, [username]);
  return { score, loading, error };
};
export const useAsyncAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = async (asyncFn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, execute };
};
export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
};
export const useFadeInOut = (isVisible, delay = 0) => {
  const [isRendered, setIsRendered] = useState(isVisible);
  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
    } else {
      const timeout = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);
  return isRendered;
};

